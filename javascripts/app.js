if (!sudoku) {
	var sudoku = {};
}

sudoku.init = {};

if (!game) {
	var game = {};
};

game = {
	setting: 'easy',
	easy: {
		init: '400537091900100200850000004509080003700020405040000700108409000020050060000003000',
		solution: '462537891937148256851692374519784623783926415246315789178469532324851967695273148'
	},
	medium: {
		init: '240057360000008009378000200060041702080000005000005010130000000050003026000812000',
		solution: '249157368516238479378496251965341782481729635723685914132564897854973126697812543'
	},
	hard: {
		init: '500127008000000020039000000040070600006000002800030009005700000000400580170090300',
		solution: '564127938718359426239684715941278653356941872827536149485763291693412587172895364'
	}
};

sudoku.init.getGameSate = function() {
	var vals = '';
	$('#game span').each(function(index) {
		text = $(this).text();
		vals += text != "" ? text : 0;
	});
	return vals;
};

sudoku.init.getGame = function(setting) {
	var a;
	if (setting == 'easy')
		a = game.easy.init;
	else if (setting == 'medium')
		a = game.medium.init;
	else if (setting == 'hard')
		a = game.hard.init;
	return a;
};

sudoku.init.getGameSolution = function(setting) {
	var a;
	if (setting == 'easy')
		a = game.easy.solution;
	else if (setting == 'medium')
		a = game.medium.solution;
	else if (setting == 'hard')
		a = game.hard.solution;
	return a;
};

sudoku.init.clearGame = function() {
	$('#game span').removeClass().text('');
};

sudoku.init.setupGame = function() {
	sudoku.init.clearGame();
		
	g = sudoku.init.getGame(game.setting);
	arr = g.split("");
	$.each(arr, function(index, value) {
		el = $('#game span').get(index);
		if (value > 0) {
			$(el).addClass('noselect').text(value);
		};		
	});
};

sudoku.init.selectCell = function(el) {
	if ($(el).hasClass('noselect')) return false;
	if ($('span.selected').length > 0) sudoku.init.deselectCell($('span.selected'));
	$(el).addClass('selected');
	sudoku.init.editCellValue();
};

sudoku.init.deselectCell = function(el) {
	$(el).removeClass();
};

sudoku.init.editCellValue = function() {
	$(window).keypress(function(e) {
		var input = String.fromCharCode(e.which);
		if (sudoku.init.checkCharValue(input) > 0)
			$('.selected').text(input);
		else
			$('.selected').text("");
	});
};

sudoku.init.checkCharValue = function(num) {
	n = parseInt(num);
	if (typeof n === 'number' && n % 1 == 0)
		return n;
};

sudoku.init.changeDifficulty = function(el) {
	if ($(el)[0].className == 'easy') {
		game.setting = 'easy';
	}	else if ($(el)[0].className == 'medium') {
		game.setting = 'medium';
	} else if ($(el)[0].className == 'hard') {
		game.setting = 'hard';
	};
		
	sudoku.init.setupGame();
};

sudoku.init.checkIfGameComplete = function() {
	$('span').each(function(index, el) {
		if ($(this).is(':empty')) {
			console.log('true');
			return true;
		}
	});
	console.log('false');
	return false;
};

sudoku.init.modified = function() {
	
};

sudoku.init.run = function() {
	if ($('#game').length) {
		sudoku.init.setupGame();
		$('span').on('click', function() {
			if ($(this).hasClass('selected')) {
				sudoku.init.deselectCell(this);
			} else {
				sudoku.init.selectCell(this);
			};			
		});
		$('#setting section').on('click', function() {
			sudoku.init.changeDifficulty($(this));
		});
		$('#wrapper').on('click', function() {
			// sudoku.init.deselectCell($('span.selected'));
		});
		$('.check_solution').on('click', function() {
			// console.log(sudoku.init.checkIfGameComplete());
			// if (!sudoku.init.checkIfGameComplete()) {
			// 				
			// 			}	
			if (sudoku.init.getGameSate() == sudoku.init.getGameSolution(game.setting)) {
				alert('Congratulations, you have completed the game!');
			} else {
				alert("That doesn't match the solution, try again.");
			}		
		});
		$('.reset').on('click', function() {
			sudoku.init.setupGame();
		});
	};
};

$(document).ready(sudoku.init.run);