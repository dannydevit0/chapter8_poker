"use strict";
/*    JavaScript 7th Edition
      Chapter 8
      Chapter case   

      Draw Poker Game using Object Oriented Programming
      Author: Olivia Gavin
      Date: 05/19/2023       

      Filename:       js08.js
 */

window.addEventListener("load", playDrawPoker);

function playDrawPoker() {
   // Reference buttons and images within the Poker Game page
   let dealButton = document.getElementById("dealB");
   let drawButton = document.getElementById("drawB");
   let standButton = document.getElementById("standB");
   let resetButton = document.getElementById("resetB");
   let statusBox = document.getElementById("status");
   let betSelection = document.getElementById("bet");
   let bankBox = document.getElementById("bank");
   let cardImages = document.querySelectorAll("img.cardImg");

   //set the initial bank and bet values
   pokerGame.currentBank = 500;
   pokerGame.currentBet = 25;

   //create a deck of shuffled cards
   let myDeck = new pokerDeck();
   myDeck.shuffle();

   // create an empty poker hand object
   let myHand = new pokerHand(5);

   // display the current bank value
   bankBox.value = pokerGame.currentBank;

   // change the bet when the selection changes
   betSelection.onchange = function() {
      pokerGame.currentBet = parseInt(this.value);
   }

      dealButton.addEventListener("click", function() {
      if (pokerGame.currentBank >= pokerGame.currentBet) {
         // Enable the Draw and Stand buttons after the initial deal
         dealButton.disabled = true;        // Turn off the Deal button
         betSelection.disabled = true;      // Turn off the Bet Selection list
         drawButton.disabled = false;       // Turn on the Draw button
         standButton.disabled = false;      // Turn on the Stand Button
         statusBox.textContent = "";        // Erase any status messages
         
         // reduce the bank by the size of the bet
         bankBox.value = pokerGame.placeBet();
         
         // get a new deck if there are less than 10 cards left
         if (myDeck.cards.length < 10) {
            myDeck = new pokerDeck();
            myDeck.shuffle();
         }

      // deal five cards from the deck to the hand
      myDeck.dealTo(myHand);
      
      // display the card images to the table
      for (let i = 0; i < cardImages.length; i++) {
         cardImages[i].src = myHand.cards[i].cardImage();

         // flip the card images when clciked
         cardImages[i].onclick = function() {
            if (this.src.includes("cardback.png")) {
               // show the front of my card
               this.src = myHand.cards[i].cardImage();
            } else {
               // show the back of the card
               this.src = "cardback.png";
            }
         }
      }

      } else {
         statusBox.textContent = "Insufficient Funds";
      }

   });
   
   
   drawButton.addEventListener("click", function() {
      // Enable the Deal and Bet options when the player chooses to draw new cards
      dealButton.disabled = false;        // Turn on the Deal button
      betSelection.disabled = false;      // Turn on the Bet Selection list
      drawButton.disabled = true;         // Turn off the Draw button
      standButton.disabled = true;        // Turn off the Stand Button

      // replace cards marked to be discarded
      for (let i = 0; i < cardImages.length; i++) {
         if (cardImages[i].src.includes("cardback.png")) {
              // replace the card and its image on the tables
              myHand.replaceCard(i, myDeck);
              cardImages[i].src = myHand.cards[i].cardImage();
          }
       }

       // evaluate the hand drawn by the user
       statusBox.textContent = myHand.getHandValue();

       // update the bank value
       bankBox.value = pokerGame.payBet(statusBox.textContent);
   });
   
    
   standButton.addEventListener("click", function() {
      // Enable the Deal and Bet options when the player chooses to stand with their hand 
      dealButton.disabled = false;        // Turn on the Deal button
      betSelection.disabled = false;      // Turn on the Bet Selection list
      drawButton.disabled = true;         // Turn off the Draw button
      standButton.disabled = true;        // Turn off the Stand Button  

      // evaluate the hand drawn by the user
      statusBox.textContent = myHand.getHandValue();

      // update the bank value
      bankBox.value = pokerGame.payBet(statusBox.textContent);
   });
   
   
   // Reload the current page when the Reset button is clicked
   resetButton.addEventListener("click", function() {
      location.reload();
   });
}