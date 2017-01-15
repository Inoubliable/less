import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { GameOverPage } from '../game-over/game-over';

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {

	private gameNumber: number;

	private initialSquares: Array<Array<Array<number>>>;

	private tiles: Array<Array<number>>;
	private squares: Array<number>;
	private whites: Array<Array<number>>;
	private blacks: Array<Array<number>>;
	private a = 16.66;

	private selectedColor: string;
	private selectedIndex: number;

	private whiteMoves: number;
	private blackMoves: number;

  constructor(private modalCtrl: ModalController) {
  	this.gameNumber = 1;
  	this.initialSquares = [
  		[[0,0,0,0], [0,0,0,0], [0,0,1,0.5], [0,0.5,0,0]],
  		[[0,0.5,0,0], [0,0,0.5,0.5], [0.5,0,0,0], [0,0,0,0]],
  		[[0,0.5,0.5,0], [1,0,0,0.5], [0,0,0,0], [0.5,0,0,0]],
  		[[0,0,0,0], [0,0,0,0], [0,0,1,0], [0,0,0,0]],
  		[[0,0,0,0], [0,0,0.5,0], [0.5,1,0,0], [0,0,0,0]],
  		[[0,0,0,0], [0,0,0.5,0], [0.5,0,0,0.5], [0,0.5,0,0]],
  		[[0,0,0,0], [0,1,0.5,0], [0.5,0,0,0], [0,0,0,0]],
  		[[1,0.5,0,0], [0,0,0,0.5], [0,0,0,0], [0,0,0,0]],
  		[[0,0,0,0], [0,0,0,0], [0,0,0,0.5], [0,0.5,1,0]],
  		[[0,0.5,0.5,0], [1,0,0,0.5], [0,0,0,0], [0.5,0,0,0]],
  		[[0,0,0,0], [0,0,0,0], [0,0,1,0.5], [0,0.5,1,0]],
  		[[1,0,0,0], [1,0,0,0], [0,0,0,0], [0,0,0,0]],
  	]

    this.chooseTiles();
	this.whites = [[0,0],[0,1],[1,0],[1,1]];
	this.blacks = [[5,5],[5,4],[4,5],[4,4]];

	this.whiteMoves = 3;
	this.blackMoves = 0;
  }

  chooseTiles() {
  	var initial = this.initialSquares;
  	var squares = [];
  	var nums = [];
  	var num;
  	var rotation;
  	var arr = [];
  	var last;
  	while(arr.length < 9) {
  		num = Math.floor((Math.random() * 12));
  		if(nums.indexOf(num) == -1) {
  			rotation = Math.floor((Math.random() * 4)) * 90;
  			arr.push([num, rotation]);
  			squares.push(initial[num]);

  			for (var i = 0; i < rotation/90; i++) {
  				last = squares[squares.length-1].pop();
				squares[squares.length-1].unshift(last);
				squares[squares.length-1].forEach(function(el) {
					last = el.pop();
					el.unshift(last);
				});
  			}

  			nums.push(num);
  		}
  	}

  	this.tiles = arr;

	var arr1 = squares.slice(0, 3);
	var arr2 = squares.slice(3, 6);
	var arr3 = squares.slice(6, 9);

	var half1 = [];
	var half2 = [];
	var whole = [];

	[arr1, arr2, arr3].forEach(function(el) {
		el.forEach(function(element) {
			half1 = half1.concat(element.slice(0, 2));
			half2 = half2.concat(element.slice(2, 4).reverse());
		});
		whole = whole.concat(half1, half2);
		half1 = [];
		half2 = [];
	});

	this.squares = whole;
  	
  }

  selectPiece(event: Event, color: string, pieceNumber: number) {
  	event.preventDefault();
  	if(color == 'white' && this.blackMoves == 0) {
  		this.selectedColor = color;
  	  	this.selectedIndex = pieceNumber;
  	} else if(color == 'black' && this.whiteMoves == 0) {
  		this.selectedColor = color;
  	  	this.selectedIndex = pieceNumber;
  	}
  }

  moveTo(targetIndex: number) {

  	if(this.selectedColor) {
	  	var x = (35 - targetIndex) % 6;
	  	var y = ((35 - targetIndex) - x) / 6;
	  	var add = 0;

  		if(this.selectedColor == 'white') {
  			var pieces = this.whites;
  			var opponentPieces = this.blacks;
  		} else if(this.selectedColor == 'black') {
  			var pieces = this.blacks;
  			var opponentPieces = this.whites;
  		}

		var piece = pieces[this.selectedIndex];
		var move = false;
		var sqrs = this.squares;
		var winCounter = 0;

		if(piece[1] == y) {

			if(piece[0] - x == 1) {
				add = sqrs[targetIndex][3] + sqrs[targetIndex - 1][1];
				move = true;
			} else if(piece[0] - x == -1) {
				add = sqrs[targetIndex][1] + sqrs[targetIndex + 1][3];
				move = true;
			} else if(piece[0] - x == 2) {
				
				pieces.forEach(function(element) {
					if(element[0] == (piece[0] - 1) && element[1] == y) {
						add = sqrs[targetIndex][3] + sqrs[targetIndex - 1][1] + sqrs[targetIndex - 1][3] + sqrs[targetIndex - 2][1];
						
						if(add == 0) {
							move = true;
						}
					}
				});

				opponentPieces.forEach(function(element) {
					if(element[0] == (piece[0] - 1) && element[1] == y) {
						add = sqrs[targetIndex][3] + sqrs[targetIndex - 1][1] + sqrs[targetIndex - 1][3] + sqrs[targetIndex - 2][1];
						
						if(add == 0) {
							move = true;
						}
					}
				});

			} else if(piece[0] - x == -2) {
				
				pieces.forEach(function(element) {
					if(element[0] == (piece[0] + 1) && element[1] == y) {
						add = sqrs[targetIndex][1] + sqrs[targetIndex + 1][3] + sqrs[targetIndex + 1][1] + sqrs[targetIndex + 2][3];
						
						if(add == 0) {
							move = true;
						}
					}
				});

				opponentPieces.forEach(function(element) {
					if(element[0] == (piece[0] + 1) && element[1] == y) {
						add = sqrs[targetIndex][1] + sqrs[targetIndex + 1][3] + sqrs[targetIndex + 1][1] + sqrs[targetIndex + 2][3];
						
						if(add == 0) {
							move = true;
						}
					}
				});

			} else {
				console.log('Illegal move!');
			}

		} else if(piece[0] == x) {

			if(piece[1] - y == 1) {
				add = sqrs[targetIndex][0] + sqrs[targetIndex - 6][2];
				move = true;
			} else if(piece[1] - y == -1) {
				add = sqrs[targetIndex][2] + sqrs[targetIndex + 6][0];
				move = true;
			} else if(piece[1] - y == 2) {
				
				pieces.forEach(function(element) {
					if(element[1] == (piece[1] - 1) && element[0] == x) {
						add = sqrs[targetIndex][0] + sqrs[targetIndex - 6][2] + sqrs[targetIndex - 6][0] + sqrs[targetIndex - 12][2];
						
						if(add == 0) {
							move = true;
						}
					}
				});

				opponentPieces.forEach(function(element) {
					if(element[1] == (piece[1] - 1) && element[0] == x) {
						add = sqrs[targetIndex][0] + sqrs[targetIndex - 6][2] + sqrs[targetIndex - 6][0] + sqrs[targetIndex - 12][2];
						
						if(add == 0) {
							move = true;
						}
					}
				});

			} else if(piece[1] - y == -2) {
				
				pieces.forEach(function(element) {
					if(element[1] == (piece[1] + 1) && element[0] == x) {
						add = sqrs[targetIndex][2] + sqrs[targetIndex + 6][0] + sqrs[targetIndex + 6][2] + sqrs[targetIndex + 12][0];
						
						if(add == 0) {
							move = true;
						}
					}
				});

				opponentPieces.forEach(function(element) {
					if(element[1] == (piece[1] + 1) && element[0] == x) {
						add = sqrs[targetIndex][2] + sqrs[targetIndex + 6][0] + sqrs[targetIndex + 6][2] + sqrs[targetIndex + 12][0];
						
						if(add == 0) {
							move = true;
						}
					}
				});

			} else {
				console.log('Illegal move!');
			}

		} else {
			console.log('Illegal move!');
		}

		// move if legal and if enough moves available
		if(move && (add + 1) <= this.whiteMoves) {
			this.whites[this.selectedIndex] = [x,y];
			this.whiteMoves = this.whiteMoves - add - 1;

			if(this.gameNumber % 2 == 1) {
				this.whites.forEach(function(coordinates) {
					if((coordinates[0] == 5 && coordinates[1] == 5) ||
						(coordinates[0] == 5 && coordinates[1] == 4) ||
						(coordinates[0] == 4 && coordinates[1] == 5) ||
						(coordinates[0] == 4 && coordinates[1] == 4))
					{
						winCounter += 1;
					}
				});
			} else {
				this.whites.forEach(function(coordinates) {
					if((coordinates[0] == 0 && coordinates[1] == 0) ||
						(coordinates[0] == 0 && coordinates[1] == 1) ||
						(coordinates[0] == 1 && coordinates[1] == 0) ||
						(coordinates[0] == 1 && coordinates[1] == 1))
					{
						winCounter += 1;
					}
				});
			}

			if(winCounter == 4) {
				this.gameOver('White');
			} else {
				winCounter = 0;
			}

			if(this.whiteMoves == 0) {
				this.blackMoves = 3;
				document.getElementById('white-tile').classList.remove('active-tile');
				document.getElementById('black-tile').classList.add('active-tile');
			}
  			
  		} else if(move && (add + 1) <= this.blackMoves) {
			this.blacks[this.selectedIndex] = [x,y];
			this.blackMoves = this.blackMoves - add - 1;

			if(this.gameNumber % 2 == 1) {
				this.blacks.forEach(function(coordinates) {
					if((coordinates[0] == 0 && coordinates[1] == 0) ||
						(coordinates[0] == 0 && coordinates[1] == 1) ||
						(coordinates[0] == 1 && coordinates[1] == 0) ||
						(coordinates[0] == 1 && coordinates[1] == 1))
					{
						winCounter += 1;
					}
				});
			} else {
				this.blacks.forEach(function(coordinates) {
					if((coordinates[0] == 5 && coordinates[1] == 5) ||
						(coordinates[0] == 5 && coordinates[1] == 4) ||
						(coordinates[0] == 4 && coordinates[1] == 5) ||
						(coordinates[0] == 4 && coordinates[1] == 4))
					{
						winCounter += 1;
					}
				});
			}

			if(winCounter == 4) {
				this.gameOver('Black');
			} else {
				winCounter = 0;
			}

			if(this.blackMoves == 0) {
				this.whiteMoves = 3;
				document.getElementById('black-tile').classList.remove('active-tile');
				document.getElementById('white-tile').classList.add('active-tile');
			}
  			
  		}

  		this.selectedColor = undefined;
  	}
  }

	gameOver(winner: string) {
		let gameOverModal = this.modalCtrl.create(GameOverPage, { winner: winner });
		gameOverModal.onDidDismiss(() => {
	    	this.gameNumber++;
	    	if(this.gameNumber % 2 == 0) {
				this.whites = [[5,5],[5,4],[4,5],[4,4]];
				this.blacks = [[0,0],[0,1],[1,0],[1,1]];
				this.whiteMoves = 3;
				this.blackMoves = 0;
	    	}
	   	});
		gameOverModal.present();
	}

}