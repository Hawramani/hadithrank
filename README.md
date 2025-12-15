# HadithRank Algorithm JS Implementation

A JavaScript implementation of the **HadithRank** algorithm—a probabilistic method for evaluating the integrity of Hadith transmission chains based on Information Theory.

## 📖 About HadithRank

**HadithRank** is an algorithmic alternative to the traditional *ṣaḥīḥ-ḍaʿīf* grading system. It utilizes principles from **Information Theory**—specifically redundancy and channel capacity—to determine the "Likelihood of Integrity" (LI) of a report based on its transmission topology.

Unlike traditional binary or tertiary classifications, HadithRank produces a continuous reliability score (0-100%) by recursively analyzing the structure of witnesses (parallel channels) and transmission links (serial attenuation).

### How It Works
The algorithm models the *isnād* (transmission chain) as a signal propagation network:
1.  **Parallel Combination (Siblings):** Multiple independent transmitters reduce the probability of error using the noisy-OR rule: `1 - ∏(1 - LI_child)`.
2.  **Serial Attenuation (Parent-Child):** Transmission from a narrator to their student acts as a bottleneck, multiplying the signal by an attenuation factor (fidelity coefficient): `LI_parent * α`.
3.  **Bottleneck Property:** A node's unreliability cannot be completely overcome by downstream branching; the "weakest link" strictly limits the maximum possible integrity of that branch.

> **Read the full methodology:** > [The HadithRank Algorithm: From Subjective Sahih-Daif Grades to Objective Mathematical Scores Based on Information Theory](https://hawramani.com/the-hadithrank-algorithm-from-subjective-sahih-daif-to-objective-mathematical-scores-based-on-information-theory/)

---

## ⚖️ Attribution & Disclaimer

**The HadithRank algorithm is the intellectual work of Ikram Hawramani.**

This repository contains a code implementation of the mathematical definitions provided in the article linked above. This implementation does not claim originality over the algorithm itself, only the specific JavaScript code structure provided herein.

**Forking Guidelines:**
If you fork this repository, you represent that:
1.  You will retain this attribution section.
2.  You will clearly state that your work is a fork of a HadithRank implementation.
3.  You will not misrepresent the algorithm as your own original invention.

---

## 🚀 Installation

This is a standalone JavaScript class. You can include it directly in your Node.js project or browser environment.

### 1. Download
Download the `IntegrityCalculator.js` file from this repository and place it in your project folder.

### 2. Import

**Node.js:**
```javascript
const IntegrityCalculator = require('./IntegrityCalculator');
```

**ES Modules / Browser:**
```javascript
import IntegrityCalculator from './IntegrityCalculator.js';
```

---

## 💻 Usage

### Basic Example
Calculate the integrity of a hadith with multiple transmission paths. The parser accepts strings in the format `Source > Narrator A > Narrator B`.

```javascript
const IntegrityCalculator = require('./IntegrityCalculator');

// Initialize with a default attenuation (fidelity) of 0.6
// This represents 60% reliability per transmission hop
const calculator = new IntegrityCalculator(0.6);

const chains = [
    // Branch 1: Source -> A -> B -> (Witnesses C, D)
    'Source > A > B > C',
    'Source > A > B > D',
    
    // Branch 2: Source -> A -> E -> (Witness F)
    'Source > A > E > F',
    
    // Branch 3: Source -> G -> H -> I -> (Witnesses J, K, L)
    'Source > G > H > I > J',
    'Source > G > H > I > K',
    'Source > G > H > I > L'
];

const result = calculator.calculate(chains);

console.log(`Final Likelihood of Integrity: ${(result * 100).toFixed(2)}%`);
// Output: 52.89%
```

### Configuration
You can adjust the **attenuation coefficient** (`defaultDecay`) when initializing the calculator. This value represents the probability that a single narrator accurately preserves the signal across one "hop."

```javascript
// Strict evaluation (0.5 reliability per narrator)
const strictCalc = new IntegrityCalculator(0.5);

// Lenient evaluation (0.8 reliability per narrator)
const lenientCalc = new IntegrityCalculator(0.8);
```

### Input Format
Any string can be used instead of Source:
* Prophet Muhammad ﷺ > Companion 1 > Transmitter A > Transmitter B > Transmitter C

The parser is flexible with whitespace. All the following are valid:
* `Source > A > B`
* `Source>A>B`
* `Source   >    Narrator One > Narrator Two`

---

## 📄 License

This software is licensed under the **MIT License**.

```text
MIT License

Copyright (c) 2025 [Ikram Hawramani]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
