'use strict';

const chai = require('chai');
const expect = chai.expect;
const x7 = require('../index'); // Adjust the path as needed for your index.js module

/**
 * Helper function to convert a hexadecimal string to a byte array
 * @param {string} hex - The hex string
 * @returns {Array} - The byte array
 */
function hexToBytes(hex) {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes;
}

// Define test vectors
const testVectors = [
    {
        input: 'test',
        timestamp: 1234567890,
        inputFormat: 0, // String
        outputFormat: 0, // Hex String
        expected: 'ef0dcd88b9c3e5b4e1a544349929561029102c815b9af4de16ea936b56ca95cb' // Replace with actual expected hash value
 //hexString = 'ef0dcd88b9c3e5b4e1a544349929561029102c815b9af4de16ea936b56ca95cb';
    },
    {
        input: [116, 101, 115, 116], // ASCII values of 'test'
        timestamp: 1234567890,
        inputFormat: 1, // 8-bit array
        outputFormat: 1, // 8-bit array
        expected: [142, 157, 11, 140, 101, 116, 52, 103, 223, 78, 8, 183, 110, 69, 0, 0] // Replace with actual expected hash value
    },
    {
        input: new Uint32Array([0x74657374]), // 32-bit array representation of 'test'
        timestamp: 1234567890,
        inputFormat: 2, // 32-bit array
        outputFormat: 2, // 32-bit array
        expected: [142, 157, 11, 140, 101, 116, 52, 103, 223, 78, 8, 183, 110, 69, 0, 0] // Replace with actual expected hash value
    }
];

describe('X7 Hash Tests', function () {
    testVectors.forEach(function (testVector, index) {
        it(`should correctly hash input #${index + 1}`, function () {
            const result = x7.digest(testVector.input, testVector.inputFormat, testVector.outputFormat, testVector.timestamp);

            if (testVector.outputFormat === 0) { // Hex String
                expect(result).to.equal(testVector.expected);
            } else if (testVector.outputFormat === 1) { // 8-bit array
                expect(result).to.deep.equal(testVector.expected);
            } else if (testVector.outputFormat === 2) { // 32-bit array
                expect(result).to.deep.equal(hexToBytes(testVector.expected));
            }
        });
    });
});
