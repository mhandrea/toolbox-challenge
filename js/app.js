// Javascript file for the memory game.

"use strict"

var tiles = [];
var prev_img = null;
var yes = 0;
var no = 0;
var remain = 8;
var timer = null;
var i; // for use in for loops.

function prepare_list() {
	for (i = 1; i <= 32; i++) {
		tiles.push({
			num: i,
			src: 'img/tile' + i + '.jpg',
			clicked: false,
			matched: false
		});
	}
}

function stats(miss, remain, match) {
	$('#miss').text(miss);
	$('#remain').text(remain);
	$('#match').text(match);
}

$(document).ready(function() {
	$('#start').click(function() {
		prepare_list();
		$('#won').css('visibility', 'hidden');
		console.log('start pressed');
		tiles = _.shuffle(tiles);
		var pairs = [];
		_.forEach(tiles.slice(0, 8), function(tile) {
			pairs.push(tile);
			pairs.push(_.clone(tile));
		});
		pairs = _.shuffle(pairs);

		// Populate the board with the tile images.
		var board = $('#board');
		var row = $(document.createElement('div'));
		var img;
		_.forEach(pairs, function(tile, i) {
			if (i % 4 == 0 && i > 0) { // only want 4 tiles per row.
				board.append(row);
				row = $(document.createElement('div'));
			}

			img = $(document.createElement('img'));
			img.attr({
				src: 'img/tile-back.png',
				alt: 'tile' + tile.num
			});
			img.data('tile', tile);
			row.append(img);
		});
		board.append(row);
		console.log('starting new game');
		stats(0, 8, 0);
		yes = 0;
		no = 0;
		remain = 8;

		// setup the timer
		var start = Date.now();
		timer = window.setInterval(function() {
			var time_pass = Math.floor((Date.now() - start) / 1000); // divide by 1000 because it is in milliseconds.
			$('#time').text(time_pass);
		}, 1000);


		$('#board img').click(function() {
			console.log($(this).data('tile').num);
			var image = $(this);
			var tile = image.data('tile');

			if (!tile.matched && !image.is(prev_img)) {
				clicked_tile(image, tile);
				check_match(image, tile);
			}

			stats(no, remain, yes);
			if (yes == 8 || remain == 0) { // if all matches are found
				console.log('you won');
				var board = $('#board');
				$('#won').css('visibility', 'visible');
				window.setTimeout(function() {
					board.empty();
					tiles = [];
				}, 1000);
				window.clearInterval(timer);
			}
		});
	});

	function clicked_tile(image, tile) {
		console.log(tile.clicked);
		if (!tile.clicked) {
			image.attr('src', tile.src);
			console.log("image was pressed!");
			tile.clicked = true;
		}
		else {
			image.attr('src', 'img/tile-back.png');
			tile.clicked = false;
		}
	}

	function check_match(image, tile) {
		if (prev_img) {
			var prev_tile = prev_img.data('tile');
			var prev_img2 = prev_img;
			if (prev_tile.num == tile.num) { // is a match, the previousy clicked image is the same as the currently clicked one.
				tile.matched = true;
				prev_tile.matched = true;
				yes++;
				remain--;
			}
			else { // Not a match. The previously clicked image is the not same as the currently clicked one.
				no++;
				window.setTimeout(function() {
					clicked_tile(image, tile);
					clicked_tile(prev_img2, prev_tile)
				}, 1000);
			}
			prev_img = null;
		}
		else {
			prev_img = image;
		}
	}

	function onTimer() {

	}

});
