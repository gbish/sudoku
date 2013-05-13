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
	
	$('#keyboard').hide();
		
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
	if ($('span.selected').length > 0) sudoku.init.deselectCell();
	$(el).addClass('selected');
	sudoku.init.editCellValue();
	sudoku.init.showKeyboard();
};

sudoku.init.deselectCell = function() {
	$('span.selected').removeClass();
	sudoku.init.hideKeyboard();
};

sudoku.init.editCellValue = function(val) {
	if (val) {
		if (val == 'clear') {
			$('.selected').text("");
		} else {
			$('.selected').text(val);
		}
		sudoku.init.hideKeyboard();
		sudoku.init.deselectCell();
		return;
	};
	
	$(window).keypress(function(e) {
		var input = String.fromCharCode(e.which);
		if (sudoku.init.checkCharValue(input) > 0)
			$('.selected').text(input);
		else if (sudoku.init.checkCharValue(input) == 0)
			$('.selected').text("");
		else
			return;
	});
};

sudoku.init.checkCharValue = function(num) {
	n = parseInt(num);
	if (typeof n === 'number' && n % 1 == 0)
		return n;
};

sudoku.init.changeDifficulty = function(el) {
	$('#difficulty section span').removeClass();
	if ($(el)[0].className == 'easy') {
		game.setting = 'easy';
	}	else if ($(el)[0].className == 'medium') {
		game.setting = 'medium';
	} else if ($(el)[0].className == 'hard') {
		game.setting = 'hard';
	};
	$(el).children('span').addClass('icon-checkmark');
	sudoku.init.setupGame();
};

sudoku.init.setupKeyboard = function() {
	win_height = $(window).height();
	button_height = win_height/6;
	$('#keyboard span').height(button_height).css('line-height', button_height + 'px');
};

sudoku.init.showKeyboard = function() {
	if (Modernizr.touch)
		$('#keyboard').slideDown();
};

sudoku.init.hideKeyboard = function() {
	if (Modernizr.touch)
		$('#keyboard').slideUp();
};

sudoku.init.drawGrid = function() {
	for (var i=0; i < 81; i++) {
		$('<span/>').appendTo('#game');
	};
};

sudoku.init.setupGrid = function() {	
	max_width = $('#game').width();
	cell_width = (max_width/9)-2;
	rounded = parseFloat(cell_width.toFixed(1));
	var r = sudoku.init.adjustFloat(rounded, max_width);
	$('#game span').css({
		width: r,
		height: r,
		'line-height': r + 'px'
	});
};

sudoku.init.adjustFloat = function(f, max) {
	if ((f+2)*9 > max) {
		f -= 0.1;
		this.adjustFloat(f, max)
	};
	return f;
};

sudoku.init.changeTheme = function(el) {
	theme = $(el).data('theme');
	$('#styles section span').removeClass();
	t = 'stylesheets/' + theme;
	$('head link#theme').attr('href', t);
	$(el).children('span').addClass('icon-checkmark');
};

sudoku.init.changeFontSize = function(el) {
	size = $(el).data('size');
	$('#fonts section span').removeClass();
	if (size == 'larger') {
		$('body').removeClass().addClass('larger');
	} else if (size == 'smaller') {
		$('body').removeClass().addClass('smaller');
	} else {
		$('body').removeClass();
	};
	$(el).children('span').addClass('icon-checkmark');
	sudoku.init.setupGrid();
};

sudoku.init.setupButtons = function() {
	$('#difficulty .easy span').addClass('icon-checkmark');
	$("#fonts section[data-size='normal'] span").addClass('icon-checkmark');
	$('#styles .light span').addClass('icon-checkmark');
};

sudoku.init.setDateTime = function() {
	var date = new Date();
	$('.date').html(date.toISOString());
};

sudoku.init.run = function() {
	if ($('#game').length) {
		sudoku.init.drawGrid();
		sudoku.init.setupGrid();
		sudoku.init.setupGame();
		sudoku.init.setupButtons();
		sudoku.init.setDateTime();
		
		$('#game span').on('click', function() {
			if ($(this).hasClass('selected')) {
				sudoku.init.deselectCell(this);
			} else {
				sudoku.init.selectCell(this);
			};			
		});
		
		$('#difficulty section').on('click', function() {
			sudoku.init.changeDifficulty($(this));
		});
		
		$('.check_solution').on('click', function() {
			if (sudoku.init.getGameSate() == sudoku.init.getGameSolution(game.setting)) {
				alert("Congratulations, you have completed the game!");
			} else {
				alert("That doesn't match the solution, try again.");
			}		
		});
		
		$('.reset').on('click', function() {
			sudoku.init.setupGame();
		});
		
		$('#fonts section').on('click', function() {
			sudoku.init.changeFontSize(this);
		});
		
		$('#styles section').on('click', function() {
			sudoku.init.changeTheme(this);
		});
		
		$('header span.icon-cog').on('click', function() {
			$('#nav').toggle();
		});
		
		$(window).resize(function() {
			sudoku.init.setupGrid();
		});
		
		if (Modernizr.touch) {
			sudoku.init.setupKeyboard();
			
			$('#keyboard span').on('click', function() {
				v = $(this).html();
				if ($(this).hasClass('clear'))
					sudoku.init.editCellValue("clear");
				else
					sudoku.init.editCellValue(v);
			});
		};
	};
};

$(document).ready(sudoku.init.run);