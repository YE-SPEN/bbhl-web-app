import { Component } from '@angular/core';
import { Card, Gambler } from '../types';
import { CardService } from '../card.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blackjack',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './blackjack.component.html',
  styleUrl: './blackjack.component.css'
})
export class BlackjackComponent {
  shoe: Card[] = [];
  shoeSize: number = 0;
  dealer: Gambler = this.createDealer();
  table: Gambler[] = [];
  numPlayers: number = 1;
  nextSeat: number = 0;

  constructor(
    private cardService: CardService,
  ) { }

  ngOnInit(): void {
    this.cardService.getDeck().subscribe(response => {
      for (let i = 0; i < 4; i++) {
        this.shoe.push(...response);
      }
      this.shuffle(this.shoe);
      this.shoeSize = this.shoe.length;
      this.createPlayer();
      console.log(this.shoeSize);
      console.log(this.table);
    });
  }

  shuffle(deck: Card[]): Card[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  createDealer(): Gambler {
    const newDealer: Gambler = {
      seat: -1,
      chips: 0,
      bet: 0,
      action: '',
      hand: [] as Card[],
      handVal: 0,
    };
    return newDealer;
  }

  createPlayer(): Gambler {
    const newPlayer: Gambler = {
      seat: this.nextSeat,
      chips: 100,
      bet: 0,
      action: '',
      hand: [] as Card[],
      handVal: 0,
    };
    this.table.push(newPlayer);
    this.nextSeat++;
    return newPlayer;
  }

  setNumPlayers(num: number): void {
    this.numPlayers = num;
  }

  buyChips(player: Gambler, amount: number): void {
    player.chips += amount;
  }

  placeBet(player: Gambler, bet: number): boolean {
    if (player.chips > bet) {
      player.chips -= bet;
      player.bet = bet;
      return true;
    }
    return false;
  }

  deal(): void {
    for (let i=0; i < 2; ++i) {
      for (let j = 0; j < this.table.length; j++) {
          const card = this.shoe.pop();
          if (card) {
            this.table[j].hand.push(card);
            this.table[j].handVal += card.val;
          }
        }
      const dealerCard = this.shoe.pop();
      if (dealerCard) {
        this.dealer.hand.push(dealerCard);
        this.dealer.handVal += dealerCard.val;
      } 
    }
  }

  hit(): void {

  }

  stay(): void {

  }

  double(): void {
    
  }

}
