'use strict';

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

// Import your x7 module
var x7 = require('../'); // Adjust the path to your x7 module

var longDream = 'Take this kiss upon the brow! And, in parting from you now, Thus much let me avow-- You are not wrong, who deem That my days have been a dream; Yet if hope has flown away In a night, or in a day, In a vision, or in none, Is it therefore the less gone? All that we see or seem Is but a dream within a dream. I stand amid the roar Of a surf-tormented shore, And I hold within my hand Grains of the golden sand-- How few! yet how they creep Through my fingers to the deep, While I weep--while I weep! O God! can I not grasp Them with a tighter clasp? O God! can I not save One from the pitiless wave? Is all that we see or seem But a dream within a dream?';

// Generate a timestamp
var timestamp = Date.now();

// Add tests
suite
    .add('Hash#blake', function() {
        x7.blake(longDream);
    })
    .add('Hash#bmw', function() {
        x7.bmw(longDream);
    })
    .add('Hash#groestl', function() {
        x7.groestl(longDream);
    })
    .add('Hash#skein', function() {
        x7.skein(longDream);
    })
    .add('Hash#keccak', function() {
        x7.keccak(longDream);
    })
    .add('Hash#luffa', function() {
        x7.luffa(longDream);
    })
    .add('Hash#echo', function() {
        x7.echo(longDream);
    })
    .add('HashX7', function() {
        x7.hashX7(longDream, timestamp); // Include timestamp for x7
    })
    // Add listeners
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    // Run async
    .run({'async': true});
