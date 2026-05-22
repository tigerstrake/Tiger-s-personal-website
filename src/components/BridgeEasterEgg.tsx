"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from "react";

interface Card {
  suit: "S" | "H" | "D" | "C";
  rank: string; // '2'-'10', 'J', 'Q', 'K', 'A'
  value: number; // 2-14
}

interface TrickCard {
  card: Card;
  player: "S" | "W" | "N" | "E";
}

interface BridgeGameState {
  hands: {
    S: Card[];
    W: Card[];
    N: Card[];
    E: Card[];
  };
  contract: {
    level: number;
    suit: "S" | "H" | "D" | "C" | "NT";
    declarer: "S" | "N";
  };
  tricksWon: {
    NS: number;
    EW: number;
  };
  currentTrick: TrickCard[];
  currentPlayer: "S" | "W" | "N" | "E";
  tricksPlayed: number;
  isActive: boolean;
}

const suitSymbols = { S: "♠", H: "♥", D: "♦", C: "♣" };

// Helper to determine rank value
function getCardValue(rank: string): number {
  if (rank === "A") return 14;
  if (rank === "K") return 13;
  if (rank === "Q") return 12;
  if (rank === "J") return 11;
  return parseInt(rank, 10);
}

// Generate standard 52-card deck
function generateDeck(): Card[] {
  const deck: Card[] = [];
  const suits = ["S", "H", "D", "C"] as const;
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank, value: getCardValue(rank) });
    }
  }
  return deck;
}

// Shuffle deck using Fisher-Yates algorithm
function shuffle(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

// Sort hand by suit (S, H, D, C) and then rank descending
function sortHand(hand: Card[]): Card[] {
  const suitOrder = { S: 0, H: 1, D: 2, C: 3 };
  return [...hand].sort((a, b) => {
    if (suitOrder[a.suit] !== suitOrder[b.suit]) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return b.value - a.value;
  });
}

// Print a hand with selection indices to console
function printHand(label: string, hand: Card[], startIndex: number = 1) {
  const grouped = {
    S: [] as { card: Card; idx: number }[],
    H: [] as { card: Card; idx: number }[],
    D: [] as { card: Card; idx: number }[],
    C: [] as { card: Card; idx: number }[],
  };
  
  hand.forEach((card, i) => {
    grouped[card.suit].push({ card, idx: startIndex + i });
  });
  
  const formatSuitGroupIndexed = (suit: "S" | "H" | "D" | "C", items: { card: Card; idx: number }[]) => {
    const symbol = suitSymbols[suit];
    const suitColor = {
      S: "color: #60a5fa; font-weight: bold;",
      H: "color: #f87171; font-weight: bold;",
      D: "color: #fb923c; font-weight: bold;",
      C: "color: #34d399; font-weight: bold;",
    }[suit];
    
    if (items.length === 0) {
      return {
        text: `%c${symbol} %c—%c`,
        styles: [suitColor, "color: #6b7280;", ""],
      };
    }
    
    let text = `%c${symbol} %c`;
    const itemStyles: string[] = [suitColor, "color: #9ca3af;"];
    
    items.forEach((item, index) => {
      text += `%c[${item.idx}]%c${item.card.rank}`;
      itemStyles.push(
        "color: #f59e0b; font-weight: bold; font-size: 0.9em;", // Index style (Amber)
        "color: #e5e7eb; font-weight: 500; font-size: 1.05em;"  // Card rank style (Light gray)
      );
      if (index < items.length - 1) {
        text += "  ";
      }
    });
    text += "%c";
    itemStyles.push("color: #9ca3af;");
    
    return {
      text,
      styles: itemStyles,
    };
  };
  
  const sFormat = formatSuitGroupIndexed("S", grouped.S);
  const hFormat = formatSuitGroupIndexed("H", grouped.H);
  const dFormat = formatSuitGroupIndexed("D", grouped.D);
  const cFormat = formatSuitGroupIndexed("C", grouped.C);
  
  console.log(`%c${label}:`, "color: #e5e7eb; font-weight: bold; font-size: 1.05em;");
  console.log(`  ${sFormat.text}`, ...sFormat.styles);
  console.log(`  ${hFormat.text}`, ...hFormat.styles);
  console.log(`  ${dFormat.text}`, ...dFormat.styles);
  console.log(`  ${cFormat.text}`, ...cFormat.styles);
}

// Format trick cells cleanly
function formatCell(tc?: TrickCard) {
  if (!tc) return { text: "--", style: "color: #4b5563;" };
  const card = tc.card;
  const color = {
    S: "color: #60a5fa; font-weight: bold;",
    H: "color: #f87171; font-weight: bold;",
    D: "color: #fb923c; font-weight: bold;",
    C: "color: #34d399; font-weight: bold;",
  }[card.suit];
  return {
    text: `${suitSymbols[card.suit]}${card.rank}`,
    style: color,
  };
}

// Print trick states in aligned layout
function printTrickState(currentTrick: TrickCard[]) {
  const sPlay = currentTrick.find(tc => tc.player === "S");
  const wPlay = currentTrick.find(tc => tc.player === "W");
  const nPlay = currentTrick.find(tc => tc.player === "N");
  const ePlay = currentTrick.find(tc => tc.player === "E");
  
  const sf = formatCell(sPlay);
  const wf = formatCell(wPlay);
  const nf = formatCell(nPlay);
  const ef = formatCell(ePlay);
  
  console.log(`%cCurrent Trick:`, "color: #e5e7eb; font-weight: bold; margin-bottom: 2px;");
  
  // North row
  console.log(`          %c${nf.text} %c(North)`, nf.style, "color: #9ca3af; font-size: 0.85em;");
  
  // West & East row
  console.log(
    `  %c${wf.text} %c(West)        %c${ef.text} %c(East)`,
    wf.style, "color: #9ca3af; font-size: 0.85em;",
    ef.style, "color: #9ca3af; font-size: 0.85em;"
  );
  
  // South row
  console.log(`          %c${sf.text} %c(South)`, sf.style, "color: #9ca3af; font-size: 0.85em;");
}

// Next player
function getNextPlayer(player: "S" | "W" | "N" | "E"): "S" | "W" | "N" | "E" {
  if (player === "S") return "W";
  if (player === "W") return "N";
  if (player === "N") return "E";
  return "S";
}

// Parser card strings
function parseCardInput(input: string): { rank: string; suit: "S" | "H" | "D" | "C" } | null {
  if (!input || typeof input !== "string") return null;
  
  const clean = input.trim().toUpperCase();
  if (clean.length < 2 || clean.length > 3) return null;
  
  let rankStr = "";
  let suitChar = "";
  
  if (clean.startsWith("10")) {
    rankStr = "10";
    suitChar = clean.substring(2);
  } else {
    rankStr = clean.substring(0, 1);
    suitChar = clean.substring(1);
  }
  
  const validRanks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  if (!validRanks.includes(rankStr)) return null;
  
  let suit: "S" | "H" | "D" | "C" | null = null;
  if (suitChar === "S" || suitChar === "♠") suit = "S";
  else if (suitChar === "H" || suitChar === "♥") suit = "H";
  else if (suitChar === "D" || suitChar === "♦") suit = "D";
  else if (suitChar === "C" || suitChar === "♣") suit = "C";
  
  if (!suit) return null;
  
  return { rank: rankStr, suit };
}

// Bidding Sequence
function printSimulatedBidding(contractSuit: "S" | "H" | "D" | "C" | "NT", contractLevel: number) {
  const suitNames = { S: "♠", H: "♥", D: "♦", C: "♣", NT: "NT" };
  
  console.log(`%cBidding Sequence:`, "color: #e5e7eb; font-weight: bold;");
  console.log(`  %cWest      North (Tiger)    East      South (You)`, "color: #9ca3af; font-weight: bold;");
  console.log(`  %c-------------------------------------------------`, "color: #4b5563;");
  
  const m = suitNames[contractSuit as "S" | "H" | "D" | "C"];
  
  if (contractSuit === "NT") {
    if (contractLevel === 1) {
      console.log(`  Pass      1♣               Pass      %c1NT`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    } else if (contractLevel === 2) {
      console.log(`  Pass      1♣               Pass      1NT`);
      console.log(`  Pass      %c2NT%c              Pass      Pass`, "color: #fbbf24; font-weight: bold;", "color: #e5e7eb;");
      console.log(`  Pass`);
    } else if (contractLevel === 3) {
      console.log(`  Pass      1♣               Pass      1NT`);
      console.log(`  Pass      2NT              Pass      %c3NT`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    } else if (contractLevel === 4) {
      console.log(`  Pass      1♣               Pass      3NT`);
      console.log(`  Pass      %c4NT%c              Pass      Pass`, "color: #fbbf24; font-weight: bold;", "color: #e5e7eb;");
      console.log(`  Pass`);
    } else if (contractLevel === 5) {
      console.log(`  Pass      1♣               Pass      3NT`);
      console.log(`  Pass      4NT              Pass      %c5NT`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    } else if (contractLevel === 6) {
      console.log(`  Pass      1♣               Pass      3NT`);
      console.log(`  Pass      4NT              Pass      %c6NT`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    } else {
      console.log(`  Pass      1♣               Pass      3NT`);
      console.log(`  Pass      4NT              Pass      %c7NT`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    }
  } else if (contractSuit === "S" || contractSuit === "H") {
    if (contractLevel === 1) {
      console.log(`  Pass      1♣               Pass      %c1${m}`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    } else if (contractLevel === 2) {
      console.log(`  Pass      1♣               Pass      1${m}`);
      console.log(`  Pass      %c2${m}%c              Pass      Pass`, "color: #fbbf24; font-weight: bold;", "color: #e5e7eb;");
      console.log(`  Pass`);
    } else if (contractLevel === 3) {
      console.log(`  Pass      1♣               Pass      1${m}`);
      console.log(`  Pass      2${m}              Pass      %c3${m}`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    } else if (contractLevel === 4) {
      console.log(`  Pass      1♣               Pass      1${m}`);
      console.log(`  Pass      3${m}              Pass      %c4${m}`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    } else if (contractLevel === 5) {
      console.log(`  Pass      1♣               Pass      1${m}`);
      console.log(`  Pass      3${m}              Pass      4NT`);
      console.log(`  Pass      5♦               Pass      %c5${m}`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    } else if (contractLevel === 6) {
      console.log(`  Pass      1♣               Pass      1${m}`);
      console.log(`  Pass      3${m}              Pass      4NT`);
      console.log(`  Pass      5♥               Pass      %c6${m}`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    } else {
      console.log(`  Pass      1♣               Pass      1${m}`);
      console.log(`  Pass      3${m}              Pass      4NT`);
      console.log(`  Pass      5♠               Pass      %c7${m}`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    }
  } else {
    const oppMajor = contractSuit === "C" ? "♥" : "♠";
    if (contractLevel === 1) {
      console.log(`  Pass      Pass             Pass      %c1${m}`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    } else if (contractLevel === 2) {
      console.log(`  Pass      1${oppMajor}               Pass      %c2${m}`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    } else if (contractLevel === 3) {
      console.log(`  Pass      1${oppMajor}               Pass      2${m}`);
      console.log(`  Pass      %c3${m}%c              Pass      Pass`, "color: #fbbf24; font-weight: bold;", "color: #e5e7eb;");
      console.log(`  Pass`);
    } else if (contractLevel === 4) {
      console.log(`  Pass      1${oppMajor}               Pass      2${m}`);
      console.log(`  Pass      3${m}              Pass      %c4${m}`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    } else if (contractLevel === 5) {
      console.log(`  Pass      1${oppMajor}               Pass      2${m}`);
      console.log(`  Pass      3${m}              Pass      %c5${m}`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    } else if (contractLevel === 6) {
      console.log(`  Pass      1${oppMajor}               Pass      2${m}`);
      console.log(`  Pass      3${m}              Pass      4NT`);
      console.log(`  Pass      5♠               Pass      %c6${m}`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    } else {
      console.log(`  Pass      1${oppMajor}               Pass      2${m}`);
      console.log(`  Pass      3${m}              Pass      4NT`);
      console.log(`  Pass      5♠               Pass      %c7${m}`, "color: #fbbf24; font-weight: bold;");
      console.log(`  Pass      Pass             Pass`);
    }
  }
}

// Print full Board state
function printBoard(state: BridgeGameState) {
  const suitNames = { S: "♠", H: "♥", D: "♦", C: "♣", NT: "NT" };
  const contractStr = `${state.contract.level}${suitNames[state.contract.suit]}`;
  const needed = state.contract.level + 6;
  
  console.log(`\n%c======================================================`, "color: #3b82f6; font-weight: bold;");
  console.log(`%c BRIDGE HAND | Contract: ${contractStr} by South | Partner: Tiger`, "color: #e5e7eb; font-weight: bold;");
  console.log(`%c Tricks Won: NS (Us): ${state.tricksWon.NS} / ${needed} needed | EW (Them): ${state.tricksWon.EW}`, "color: #9ca3af; font-weight: 500;");
  console.log(`%c======================================================`, "color: #3b82f6; font-weight: bold;");
  
  printHand("Dummy's Hand (North - Tiger)", state.hands.N, 1);
  console.log("");
  
  printTrickState(state.currentTrick);
  console.log("");
  
  printHand("Your Hand (South - Mr. Pichai)", state.hands.S, 1);
  console.log(`%c======================================================`, "color: #3b82f6; font-weight: bold;");
  
  const nameMap = { S: "South (You - Mr. Pichai)", N: "North (Tiger - Dummy)" };
  const current = state.currentPlayer as "S" | "N";
  console.log(`It is %c${nameMap[current]}%c's turn.`, "color: #fbbf24; font-weight: bold;", "");
  console.log(`Type %cplay(number)%c to play by index (e.g. play(3)) or %cplay("card")%c (e.g. play("AH")).`, "color: #fbbf24; font-weight: bold;", "", "color: #fbbf24; font-weight: bold;", "");
}

// Print Game Over screen
function printGameOver(state: BridgeGameState) {
  const needed = state.contract.level + 6;
  const won = state.tricksWon.NS;
  const suitNames = { S: "♠", H: "♥", D: "♦", C: "♣", NT: "NT" };
  const contractStr = `${state.contract.level}${suitNames[state.contract.suit]}`;
  
  console.log(`\n%c======================================================`, "color: #fbbf24; font-weight: bold;");
  console.log(`%c                   GAME OVER`, "color: #fbbf24; font-weight: bold; font-size: 1.2em;");
  console.log(`%c======================================================`, "color: #fbbf24; font-weight: bold;");
  console.log(`Contract: ${contractStr}`);
  console.log(`Tricks Won: NS (Us): ${won} | EW (Them): ${state.tricksWon.EW}`);
  
  if (won >= needed) {
    const overtricks = won - needed;
    const overtricksStr = overtricks > 0 ? ` with ${overtricks} overtrick(s)` : "";
    console.log(`\n%c🎉 Congratulations! North (Tiger) and South (You - Mr. Pichai) MADE the contract${overtricksStr}!`, "color: #34d399; font-weight: bold; font-size: 1.1em;");
    console.log(`%cTiger: "GG, Mr. Pichai! Masterclass in card play. We make a great team."`, "color: #60a5fa; font-weight: bold;");
  } else {
    const down = needed - won;
    console.log(`\n%cDown ${down}! You went down in the contract.`, "color: #f87171; font-weight: bold; font-size: 1.1em;");
    console.log(`%cTiger: "Ah, unlucky! A tough break on the layout. Let's run it back?"`, "color: #a1a1aa; font-weight: bold;");
  }
  
  console.log(`\nType %cplayBridge()%c to deal a new hand.`, "color: #f59e0b; font-weight: bold;", "");
  console.log(`%c======================================================`, "color: #374151");
}

// AI plays East / West
function playAICard(state: BridgeGameState, player: "E" | "W") {
  const hand = state.hands[player];
  if (hand.length === 0) return;
  
  let cardToPlay: Card;
  
  if (state.currentTrick.length === 0) {
    const idx = Math.floor(Math.random() * hand.length);
    cardToPlay = hand[idx];
  } else {
    const ledSuit = state.currentTrick[0].card.suit;
    const sameSuitCards = hand.filter(c => c.suit === ledSuit);
    
    if (sameSuitCards.length > 0) {
      const idx = Math.floor(Math.random() * sameSuitCards.length);
      cardToPlay = sameSuitCards[idx];
    } else {
      const trumpSuit = state.contract.suit;
      const trumpCards = hand.filter(c => c.suit === trumpSuit);
      if (trumpCards.length > 0 && Math.random() < 0.3) {
        const idx = Math.floor(Math.random() * trumpCards.length);
        cardToPlay = trumpCards[idx];
      } else {
        const nonTrumps = hand.filter(c => c.suit !== trumpSuit);
        const pool = nonTrumps.length > 0 ? nonTrumps : hand;
        const idx = Math.floor(Math.random() * pool.length);
        cardToPlay = pool[idx];
      }
    }
  }
  
  // Remove from hand
  state.hands[player] = hand.filter(c => c !== cardToPlay);
  
  // Add to trick
  state.currentTrick.push({ card: cardToPlay, player });
  
  // Log play
  const nameMap = { E: "East", W: "West" };
  const color = {
    S: "color: #60a5fa; font-weight: bold;",
    H: "color: #f87171; font-weight: bold;",
    D: "color: #fb923c; font-weight: bold;",
    C: "color: #34d399; font-weight: bold;",
  }[cardToPlay.suit];
  console.log(
    `%c${nameMap[player]} plays: %c${suitSymbols[cardToPlay.suit]}${cardToPlay.rank}`,
    "color: #a1a1aa;",
    color
  );
  
  // Next turn
  state.currentPlayer = getNextPlayer(player);
}

// Evaluate trick completion
function resolveTrick(state: BridgeGameState) {
  const currentTrick = state.currentTrick;
  if (currentTrick.length !== 4) return;
  
  const trumpSuit = state.contract.suit;
  
  let winningPlay = currentTrick[0];
  
  for (let i = 1; i < currentTrick.length; i++) {
    const play = currentTrick[i];
    const winCard = winningPlay.card;
    const playCard = play.card;
    
    let isNewPlayBetter = false;
    
    if (playCard.suit === trumpSuit && winCard.suit !== trumpSuit) {
      isNewPlayBetter = true;
    } else if (playCard.suit === winCard.suit) {
      if (playCard.value > winCard.value) {
        isNewPlayBetter = true;
      }
    }
    
    if (isNewPlayBetter) {
      winningPlay = play;
    }
  }
  
  const winner = winningPlay.player;
  
  if (winner === "S" || winner === "N") {
    state.tricksWon.NS++;
  } else {
    state.tricksWon.EW++;
  }
  
  state.tricksPlayed++;
  
  const nameMap = { S: "South (You - Mr. Pichai)", N: "North (Tiger)", E: "East", W: "West" };
  console.log(`\n%cTrick won by ${nameMap[winner]} with ${suitSymbols[winningPlay.card.suit]}${winningPlay.card.rank}!`, "color: #fbbf24; font-weight: bold;");
  
  state.currentTrick = [];
  state.currentPlayer = winner;
  
  if (state.tricksPlayed === 13) {
    state.isActive = false;
    printGameOver(state);
  } else {
    console.log(`%c------------------------------------------------------`, "color: #374151;");
  }
}

// Run AI updates
function runAILoop(state: BridgeGameState) {
  while (state.isActive && (state.currentPlayer === "E" || state.currentPlayer === "W")) {
    playAICard(state, state.currentPlayer);
    if (state.currentTrick.length === 4) {
      resolveTrick(state);
    }
  }
}

export default function BridgeEasterEgg() {
  useEffect(() => {
    const playBridge = () => {
      const deck = shuffle(generateDeck());
      
      const southHand = sortHand(deck.slice(0, 13));
      const westHand = sortHand(deck.slice(13, 26));
      const northHand = sortHand(deck.slice(26, 39));
      const eastHand = sortHand(deck.slice(39, 52));
      
      // Determine contract based on fit
      const countBySuit = { S: 0, H: 0, D: 0, C: 0 };
      for (const card of [...southHand, ...northHand]) {
        countBySuit[card.suit]++;
      }
      let bestSuit: "S" | "H" | "D" | "C" | "NT" = "NT";
      let maxCount = 0;
      for (const suit of ["S", "H", "D", "C"] as const) {
        if (countBySuit[suit] > maxCount) {
          maxCount = countBySuit[suit];
          bestSuit = suit;
        }
      }
      if (maxCount < 8) {
        bestSuit = "NT";
      }
      
      // Random Level
      const rand = Math.random();
      let level = 3;
      if (rand < 0.1) level = 1;
      else if (rand < 0.3) level = 2;
      else if (rand < 0.6) level = 3;
      else if (rand < 0.8) level = 4;
      else if (rand < 0.95) level = 5;
      else if (rand < 0.99) level = 6;
      else level = 7;
      
      const state: BridgeGameState = {
        hands: {
          S: southHand,
          W: westHand,
          N: northHand,
          E: eastHand,
        },
        contract: {
          level,
          suit: bestSuit,
          declarer: "S",
        },
        tricksWon: {
          NS: 0,
          EW: 0,
        },
        currentTrick: [],
        currentPlayer: "W", // West leads
        tricksPlayed: 0,
        isActive: true,
      };
      
      (window as any).__bridgeGameState = state;
      
      console.clear();
      console.log(`%cHey Mr Pichai! Heard you liked bridge. Let's play a game!`, "color: #fbbf24; font-weight: bold; font-size: 1.2em;");
      console.log(`%c🃏 SHUFFLING AND DEALING HAND...`, "color: #34d399; font-weight: bold; font-size: 1.15em;");
      console.log(`%cPartnering with Tiger (North) against the East/West AI defenders.`, "color: #9ca3af; font-style: italic;");
      console.log("");
      
      printSimulatedBidding(bestSuit, level);
      console.log("");
      
      const suitNames = { S: "♠", H: "♥", D: "♦", C: "♣", NT: "NT" };
      console.log(`West leads first. Play begins! Contract: %c${level}${suitNames[bestSuit]} by South%c`, "color: #f59e0b; font-weight: bold;", "");
      console.log(`%c------------------------------------------------------`, "color: #374151;");
      
      // Let West lead
      runAILoop(state);
      
      // Print first state
      printBoard(state);
    };
    
    const play = (cardInput: string | number) => {
      const state = (window as any).__bridgeGameState as BridgeGameState;
      if (!state || !state.isActive) {
        console.log("%cNo active Bridge game! Type playBridge() to start a game.", "color: #f87171; font-weight: bold;");
        return;
      }
      
      if (state.currentPlayer !== "S" && state.currentPlayer !== "N") {
        console.log("%cIt is not your turn to play! (Defenders are playing).", "color: #f87171; font-weight: bold;");
        return;
      }
      
      const player = state.currentPlayer;
      const hand = state.hands[player];
      let cardToPlay: Card | null = null;
      let cardIndex = -1;
      
      // Check if input is index number
      const parsedNum = typeof cardInput === "number" ? cardInput : parseInt(String(cardInput).trim(), 10);
      
      if (!isNaN(parsedNum)) {
        cardIndex = parsedNum - 1;
        if (cardIndex < 0 || cardIndex >= hand.length) {
          console.log(`%cInvalid index ${parsedNum}. Choose a number between 1 and ${hand.length}.`, "color: #f87171; font-weight: bold;");
          return;
        }
        cardToPlay = hand[cardIndex];
      } else {
        const parsed = parseCardInput(String(cardInput));
        if (!parsed) {
          console.log(`%cInvalid card format "${cardInput}". Use index number (e.g. play(3)) or format like play("AH").`, "color: #f87171; font-weight: bold;");
          return;
        }
        
        cardIndex = hand.findIndex(c => c.suit === parsed.suit && c.rank === parsed.rank);
        if (cardIndex === -1) {
          const nameMap = { S: "your hand (South - Mr. Pichai)", N: "North's hand (Tiger)" };
          console.log(`%cThe card ${suitSymbols[parsed.suit]}${parsed.rank} is not in ${nameMap[player]}!`, "color: #f87171; font-weight: bold;");
          return;
        }
        cardToPlay = hand[cardIndex];
      }
      
      // Follow suit rule check
      if (state.currentTrick.length > 0) {
        const ledSuit = state.currentTrick[0].card.suit;
        if (cardToPlay.suit !== ledSuit) {
          const hasLedSuit = hand.some(c => c.suit === ledSuit);
          if (hasLedSuit) {
            console.log(`%cRevoke! You must follow suit. You still have ${suitSymbols[ledSuit]} in hand.`, "color: #f87171; font-weight: bold;");
            return;
          }
        }
      }
      
      // Remove from hand
      state.hands[player].splice(cardIndex, 1);
      
      // Add to trick
      state.currentTrick.push({ card: cardToPlay, player });
      
      // Log play
      const nameMap = { S: "South (You - Mr. Pichai)", N: "North (Tiger)" };
      const color = {
        S: "color: #60a5fa; font-weight: bold;",
        H: "color: #f87171; font-weight: bold;",
        D: "color: #fb923c; font-weight: bold;",
        C: "color: #34d399; font-weight: bold;",
      }[cardToPlay.suit];
      console.log(
        `%c${nameMap[player]} plays: %c${suitSymbols[cardToPlay.suit]}${cardToPlay.rank}`,
        "color: #e5e7eb;",
        color
      );
      
      // Next player
      state.currentPlayer = getNextPlayer(player);
      
      // Resolve trick
      if (state.currentTrick.length === 4) {
        resolveTrick(state);
      }
      
      // Run AI turns
      runAILoop(state);
      
      // Reprint board
      if (state.isActive) {
        printBoard(state);
      }
    };
    
    const helpBridge = () => {
      console.log(`%c♣️ BRIDGE EASTER EGG HELP ♣️`, "color: #fbbf24; font-weight: bold; font-size: 1.1em;");
      console.log("Commands available in your browser console:");
      console.log("  %cplayBridge()%c  - Start a new random bridge game partnering with Tiger.", "color: #3b82f6; font-weight: bold;", "");
      console.log("  %cplay(number)%c  - Play a card by its selection index (e.g. play(3)). Recommended!", "color: #3b82f6; font-weight: bold;", "");
      console.log("  %cplay('card')%c  - Play a card by name (e.g. play('AH'), play('10S'), play('2C')).", "color: #3b82f6; font-weight: bold;", "");
      console.log("  %cp(arg)%c        - Shorthand alias to play card (e.g. p(3) or p('KH')).", "color: #3b82f6; font-weight: bold;", "");
      console.log("  %cshowHand()%c     - Reprint the current trick, score, and hands.", "color: #3b82f6; font-weight: bold;", "");
      console.log("  %chelpBridge()%c   - Show this help menu.", "color: #3b82f6; font-weight: bold;", "");
    };
    
    const showHand = () => {
      const state = (window as any).__bridgeGameState as BridgeGameState;
      if (!state || !state.isActive) {
        console.log("%cNo active Bridge game! Type playBridge() to start a game.", "color: #f87171; font-weight: bold;");
        return;
      }
      printBoard(state);
    };
    
    (window as any).playBridge = playBridge;
    (window as any).play = play;
    (window as any).p = play;
    (window as any).helpBridge = helpBridge;
    (window as any).showHand = showHand;
    
    return () => {
      delete (window as any).playBridge;
      delete (window as any).play;
      delete (window as any).p;
      delete (window as any).helpBridge;
      delete (window as any).showHand;
      delete (window as any).__bridgeGameState;
    };
  }, []);
  
  return null;
}
