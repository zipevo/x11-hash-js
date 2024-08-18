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
 * Obtain an X7 hash
 * @param input {string|array|buffer} input data to hash
 * @param timestamp {number} optional - timestamp to include in the hash
 * @param inputFormat {number} optional - format of the input: 0: string, 1: 8-bit array/Buffer, 2: 32-bit array
 * @param outputFormat {number} optional - format of the output: 0: string, 1: 8-bit array, 2: 32-bit array
 * @returns {string|array} X7 hash of input as a string, 8-bit array, or 32-bit array
 */
module.exports.digest = function (input, timestamp, inputFormat, outputFormat) {
    if (input === undefined) {
        throw errors.input_not_specified;
    } else if (inputFormat === undefined) {
        if (!(typeof input === 'string' || input instanceof String)) {
            throw errors.input_single_invalid_type;
        }
    } else {
        if (inputFormat === 0) {
            if (!(typeof input === 'string' || input instanceof String)) {
                throw errors.input_format_mismatch_string;
            }
        } else if (inputFormat === 1 || inputFormat === 2) {
            if (!Array.isArray(input) && !h.isBuffer(input)) {
                throw errors.input_format_mismatch_array;
            }
        } else {
            throw errors.input_format_invalid;
        }
        if (outputFormat !== undefined
                && outputFormat !== 0
                && outputFormat !== 1
                && outputFormat !== 2) {
            throw errors.output_format_invalid;
        }
    }

    // Incorporate the timestamp into the initial data if provided
    var a = input;
    if (timestamp !== undefined) {
        a = h.int64ToBuffer(timestamp).concat(input);
    }

    a = blake(a, inputFormat, 2);
    a = bmw(a, 2, 2);

    // XOR operation between Blake and BMW
    a = xorArrays(blake(a, 2, 2), a);

    a = groestl(a, 2, 2);
    a = skein(a, 2, 2);

    // XOR operation between Groestl and Skein
    a = xorArrays(groestl(a, 2, 2), a);

    a = keccak(a, 2, 2);
    a = luffa(a, 2, 2);
    a = echo(a, 2, 2);

    // Final XOR operation between Luffa and Echo
    a = xorArrays(luffa(a, 2, 2), a);

    // Slice to ensure the output size is consistent
    var outputSize = outputFormat === 2 ? 32 : outputFormat === 1 ? 64 : a.length;

    // Output 32-bit array
    if (outputFormat === 2) {
        return h.int32Buffer2Bytes(a.slice(0, outputSize));
    }
    // Output 8-bit array
    else if (outputFormat === 1) {
        return a.slice(0, outputSize);
    }
    // Output string
    return h.int32ArrayToHexString(a.slice(0, outputSize));
};

/**
 * XOR two arrays element by element
 * @param arr1 {array} first array
 * @param arr2 {array} second array
 * @returns {array} result of XOR operation
 */
function xorArrays(arr1, arr2) {
    var result = [];
    for (var i = 0; i < arr1.length; i++) {
        result.push(arr1[i] ^ arr2[i]);
    }
    return result;
}

// Individual X7 hash functions
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
