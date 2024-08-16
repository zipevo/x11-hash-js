'use strict';

var x7, buffer, expect;
if (typeof module !== 'undefined' && module.exports) {
    x7 = require('../'); // Adjust the path to your implementation
    expect = require('chai').expect;
    buffer = Buffer;
} else {
    x7 = require('x7hash'); // Adjust the module name if needed
    buffer = require('buffer').Buffer;
}

var fox = 'The quick brown fox jumps over the lazy dog';
var empty = '';
var zip = 'ZIP';
var longDream = 'Take this kiss upon the brow! And, in parting from you now, Thus much let me avow-- You are not wrong, who deem That my days have been a dream; Yet if hope has flown away In a night, or in a day, In a vision, or in none, Is it therefore the less gone? All that we see or seem Is but a dream within a dream. I stand amid the roar Of a surf-tormented shore, And I hold within my hand Grains of the golden sand-- How few! yet how they creep Through my fingers to the deep, While I weep--while I weep! O God! can I not grasp Them with a tighter clasp? O God! can I not save One from the pitiless wave? Is all that we see or seem But a dream within a dream?';
var int32 = [-1245000620, -1578223460, 654805539, -1068884769, -968029107, -8582190, 491541657, 290156804, 1046922525, 1254877013, -1307320917, 1691597203, 55068107, 1715389297, 252729336, 127805489];
var bufferData = new buffer('0400000097ea9c8bee806143a8ae50116fe3d329dcbb18b5d8ea71a7a213a1b052000000b1950f668df2593684169b0e33ee7fb1b8e00d90ed906d80b4c2baa7d1b65f548f495a57ed98521d348b0700', 'hex');

// Helper function to get current timestamp in milliseconds
function getTimestamp() {
    return Math.floor(Date.now());
}

describe('X7 Hash Functions', function () {

    // Main x7 digest function tests
    describe('x7 (digest)', function () {

        it('empty string', function () {
            const timestamp = getTimestamp();
            expect(x7.digest(empty, timestamp)).to.equal('expected_hash_for_empty_string_with_timestamp');
        });

        it('fox string', function () {
            const timestamp = getTimestamp();
            expect(x7.digest(fox, timestamp)).to.equal('expected_hash_for_fox_string_with_timestamp');
        });

        it('zip string', function () {
            const timestamp = getTimestamp();
            expect(x7.digest(zip, timestamp)).to.equal('expected_hash_for_zip_string_with_timestamp');
        });

        it('dream string', function () {
            const timestamp = getTimestamp();
            expect(x7.digest(longDream, timestamp)).to.equal('expected_hash_for_dream_string_with_timestamp');
        });

        it('int32 array', function () {
            const timestamp = getTimestamp();
            expect(x7.digest(int32, timestamp, 2)).to.equal('expected_hash_for_int32_with_timestamp');
        });

        it('buffer', function () {
            const timestamp = getTimestamp();
            expect(x7.digest(bufferData, timestamp, 1)).to.equal('expected_hash_for_buffer_with_timestamp');
        });

        it('buffer outputFormat=0', function () {
            const timestamp = getTimestamp();
            expect(x7.digest(bufferData, timestamp, 1, 0)).to.equal('expected_hash_for_buffer_outputFormat_0_with_timestamp');
        });

        it('buffer outputFormat=1 -> 8 bit', function () {
            const timestamp = getTimestamp();
            expect(x7.digest(bufferData, timestamp, 1, 1)).to.deep.equal([
                // expected array for outputFormat=1 with timestamp
            ]);
        });

        it('buffer outputFormat=2 -> 32 bit', function () {
            const timestamp = getTimestamp();
            expect(x7.digest(bufferData, timestamp, 1, 2)).to.deep.equal([
                // expected array for outputFormat=2 with timestamp
            ]);
        });

        // Argument exceptions...
        describe('input argument exceptions', function () {

            it('invalid input type: missing', function () {
                expect(function () {
                    x7.digest();
                }).to.throw(x7.errors.input_not_specified);
            });

            it('invalid single-arg input type: array', function () {
                expect(function () {
                    x7.digest(int32);
                }).to.throw(x7.errors.input_single_invalid_type);
            });

            it('invalid single-arg input type: object', function () {
                expect(function () {
                    x7.digest({});
                }).to.throw(x7.errors.input_single_invalid_type);
            });
        });

        describe('inputFormat argument exceptions', function () {

            it('invalid inputFormat argument type: string', function () {
                expect(function () {
                    x7.digest(longDream, getTimestamp(), '');
                }).to.throw(x7.errors.input_format_invalid);
            });

            it('invalid inputFormat argument type: boolean', function () {
                expect(function () {
                    x7.digest(longDream, getTimestamp(), false);
                }).to.throw(x7.errors.input_format_invalid);
            });

            it('invalid inputFormat argument type: object', function () {
                expect(function () {
                    x7.digest(longDream, getTimestamp(), {});
                }).to.throw(x7.errors.input_format_invalid);
            });

            it('invalid inputFormat argument value: min', function () {
                expect(function () {
                    x7.digest(longDream, getTimestamp(), -1);
                }).to.throw(x7.errors.input_format_invalid);
            });

            it('invalid inputFormat argument value: max', function () {
                expect(function () {
                    x7.digest(longDream, getTimestamp(), 3);
                }).to.throw(x7.errors.input_format_invalid);
            });

            it('mismatch of input argument to inputFormat: string', function () {
                expect(function () {
                    x7.digest(int32, getTimestamp(), 0);
                }).to.throw(x7.errors.input_format_mismatch_string);
            });

            it('mismatch of input argument to inputFormat: array 1', function () {
                expect(function () {
                    x7.digest(longDream, getTimestamp(), 1);
                }).to.throw(x7.errors.input_format_mismatch_array);
            });

            it('mismatch of input argument to inputFormat: array 2', function () {
                expect(function () {
                    x7.digest(longDream, getTimestamp(), 2);
                }).to.throw(x7.errors.input_format_mismatch_array);
            });
        });

        describe('outputFormat argument exceptions', function () {

            it('invalid outputFormat argument type: string', function () {
                expect(function () {
                    x7.digest(longDream, getTimestamp(), 0, '');
                }).to.throw(x7.errors.output_format_invalid);
            });

            it('invalid outputFormat argument type: boolean', function () {
                expect(function () {
                    x7.digest(longDream, getTimestamp(), 0, false);
                }).to.throw(x7.errors.output_format_invalid);
            });

            it('invalid outputFormat argument type: object', function () {
                expect(function () {
                    x7.digest(longDream, getTimestamp(), 0, {});
                }).to.throw(x7.errors.output_format_invalid);
            });

            it('invalid outputFormat argument value: below min', function () {
                expect(function () {
                    x7.digest(longDream, getTimestamp(), 0, -1);
                }).to.throw(x7.errors.output_format_invalid);
            });

            it('invalid outputFormat argument value: above max', function () {
                expect(function () {
                    x7.digest(longDream, getTimestamp(), 0, 3);
                }).to.throw(x7.errors.output_format_invalid);
            });
        });
    });

    // Tests for individual hash algorithms in the x7 suite
    const hashAlgorithms = ['blake', 'bmw', 'groestl', 'skein', 'keccak', 'luffa', 'echo'];

    hashAlgorithms.forEach(function (algorithm) {
        describe(algorithm, function () {

            it('empty string', function () {
                const timestamp = getTimestamp();
                expect(x7[algorithm](empty, timestamp)).to.equal(`expected_${algorithm}_hash_for_empty_string_with_timestamp`);
            });

            it('fox string', function () {
                const timestamp = getTimestamp();
                expect(x7[algorithm](fox, timestamp)).to.equal(`expected_${algorithm}_hash_for_fox_string_with_timestamp`);
            });

            it('zip string', function () {
                const timestamp = getTimestamp();
                expect(x7[algorithm](zip, timestamp)).to.equal(`expected_${algorithm}_hash_for_zip_string_with_timestamp`);
            });

            it('dream string', function () {
                const timestamp = getTimestamp();
                expect(x7Here is the continuation and completion of the test suite for individual hash algorithms within the `x7` suite, structured to align with the description of the `HashX7` implementation:

### JavaScript Test Suite for `x7` Algorithm (continued)

```javascript
                expect(x7[algorithm](longDream, timestamp)).to.equal(`expected_${algorithm}_hash_for_dream_string_with_timestamp`);
            });

            it('int32 array', function () {
                const timestamp = getTimestamp();
                expect(x7[algorithm](int32, timestamp, 2)).to.equal(`expected_${algorithm}_hash_for_int32_with_timestamp`);
            });

            it('buffer', function () {
                const timestamp = getTimestamp();
                expect(x7[algorithm](bufferData, timestamp, 1)).to.equal(`expected_${algorithm}_hash_for_buffer_with_timestamp`);
            });

            it('buffer outputFormat=0', function () {
                const timestamp = getTimestamp();
                expect(x7[algorithm](bufferData, timestamp, 1, 0)).to.equal(`expected_${algorithm}_hash_for_buffer_outputFormat_0_with_timestamp`);
            });

            it('buffer outputFormat=1 -> 8 bit', function () {
                const timestamp = getTimestamp();
                expect(x7[algorithm](bufferData, timestamp, 1, 1)).to.deep.equal([
                    // expected array for outputFormat=1 with timestamp
                ]);
            });

            it('buffer outputFormat=2 -> 32 bit', function () {
                const timestamp = getTimestamp();
                expect(x7[algorithm](bufferData, timestamp, 1, 2)).to.deep.equal([
                    // expected array for outputFormat=2 with timestamp
                ]);
            });
        });
    });
});
