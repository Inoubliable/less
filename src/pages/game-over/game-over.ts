import { Component } from '@angular/core';
import { NavParams, ViewController, NavController } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-game-over',
  templateUrl: 'game-over.html'
})
export class GameOverPage {

	private winner;

  constructor(private navParams: NavParams, private viewCtrl: ViewController, private navCtrl: NavController) {
  	this.winner = navParams.get('winner');
  }

  playAgain() {
  	this.viewCtrl.dismiss();
  }

  exit() {
  	this.navCtrl.push(HomePage);
  }

}