'use strict';

var blake = require('./lib/blake');
var bmw = require('./lib/bmw');
var groestl = require('./lib/groestl');
var skein = require('./lib/skein');
var keccak = require('./lib/keccak').keccak_512;
var luffa = require('./lib/luffa');
var echo = require('./lib/echo');
var h = require('./lib/helper');

/**
 * Error codes
 */
var errors = module.exports.errors = {
    input_not_specified: 'input not specified',
    input_single_invalid_type: 'input must be string when inputFormat is not specified',
    input_format_mismatch_string: 'input format mismatch: input should be a string',
    input_format_mismatch_array: 'input format mismatch: input should be an array',
    input_format_invalid: 'invalid input format',
    output_format_invalid: 'invalid output format'
};

/**
 * Obtain an x7 hash
 * @param input {string|array|buffer} input data to hash
 * @param inputFormat {number} optional - format of the input: 0: string, 1: 8 bit array/Buffer, 2: 32 bit array
 * @param outputFormat {number} optional - format of the output: 0: string, 1: 8 bit array, 2: 32 bit array
 * @param timestamp {number} optional - a timestamp to incorporate into the hash
 * @returns {string|array} x7 hash of input as a string, 8-bit array or 32-bit array
 */
module.exports.digest = function (input, inputFormat, outputFormat, timestamp) {
    // Argument exceptions
    if (input === undefined) {
        throw errors.input_not_specified;
    } else if (inputFormat === undefined) {
        // Single input arg must be a string
        if (typeof input !== 'string') {
            throw errors.input_single_invalid_type;
        }
    } else {
        // Validate input arguments
        if (inputFormat === 0) {
            if (typeof input !== 'string') {
                throw errors.input_format_mismatch_string;
            }
        } else if (inputFormat === 1 || inputFormat === 2) {
            if (!Array.isArray(input) && !h.isBuffer(input)) {
                throw errors.input_format_mismatch_array;
            }
        } else {
            throw errors.input_format_invalid;
        }

        // Validate output format
        if (outputFormat !== undefined && ![0, 1, 2].includes(outputFormat)) {
            throw errors.output_format_invalid;
       }
    }

    // Incorporate the timestamp into the input
var timestampBuffer = Buffer.alloc(8);
timestampBuffer.writeBigUInt64LE(BigInt(timestamp), 0);
    var inputBuffer;
    if (typeof input === 'string') {
        inputBuffer = Buffer.from(input);
    } else if (Array.isArray(input)) {
        inputBuffer = Buffer.from(input);
    } else if (h.isBuffer(input)) {
        inputBuffer = Buffer.from(input);
    } else {
        throw new Error('Invalid input type');
    }

    // Prepend the timestamp to the input data
    var combinedInput = Buffer.concat([timestampBuffer, inputBuffer]);

    // Obtain the x7 hash of the input
    var hash = blake(combinedInput, 1, 2);
    hash = bmw(hash, 2, 2);
    hash = xor(hash, bmw(hash, 2, 2));
    hash = groestl(hash, 2, 2);
    hash = xor(hash, groestl(hash, 2, 2));
    hash = skein(hash, 2, 2);
    hash = xor(hash, skein(hash, 2, 2));
    hash = keccak(hash, 2, 1);
    hash = luffa(hash, 1, 2);
    hash = echo(hash, 2, 2);
    hash = xor(hash, echo(hash, 2, 2));
    hash = hash.slice(0, 8);

    // Output 32-bit array
    if (outputFormat === 2) {
        return h.int32Buffer2Bytes(hash);
    }
    // Output 8-bit array
    else if (outputFormat === 1) {
        return Array.from(hash); // Ensure it returns an 8-bit array
    }
    // Output string
    return h.int32ArrayToHexString(hash);
};

// XOR function for use in x7 hash stages
function xor(a, b) {
    if (a.length !== b.length) {
        throw new Error('Buffers must be of the same length for XOR');
    }
    return a.map((value, index) => value ^ b[index]);
}

// Individual x7 hash functions...
module.exports.blake = function (str, format, output) {
    return blake(str, format, output);
};

module.exports.bmw = function (str, format, output) {
    return bmw(str, format, output);
};

module.exports.groestl = function (str, format, output) {
    return groestl(str, format, output);
};

module.exports.skein = function (str, format, output) {
    return skein(str, format, output);
};

module.exports.keccak = function (str, format, output) {
    var msg = str;
    if (format === 2) {
        msg = h.int32Buffer2Bytes(str);
    }
    if (output === 1) {
        return keccak.array(msg);
    } else if (output === 2) {
        return h.bytes2Int32Buffer(keccak.array(msg));
    }
    return keccak.hex(msg);
};

module.exports.luffa = function (str, format, output) {
    return luffa(str, format, output);
};

module.exports.echo = function (str, format, output) {
    return echo(str, format, output);
};
