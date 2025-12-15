/* HadithRank Algorithm JS Implementation */
/* Copyright (c) 2025 Ikram Hawramani */
/* MIT License with Algorithm Attribution */

class IntegrityCalculator {
    constructor(defaultDecay = 0.6) {
        this.decay = defaultDecay;
        this.tree = { id: 'Source', children: [] };
    }

    /**
     * Main entry point: Calculates the final system LI from an array of text chains.
     * @param {string[]} chains - Array of strings like "Source > A > B"
     * @returns {number} - The final calculated probability (0.0 to 1.0)
     */
    calculate(chains) {
        this.buildTree(chains);
        return this.computeNode(this.tree);
    }

    /**
     * Parses text chains into a hierarchical tree structure.
     */
    buildTree(chains) {
        // Reset tree
        this.tree = { id: 'Source', children: [], isSource: true };

        for (const chainStr of chains) {
            // Split string by ' > ' or any variation of arrows/spaces
            const parts = chainStr.split(/\s*>\s*/);
            
            let currentNode = this.tree;

            // Start from index 1 because index 0 is always 'Source' (root)
            for (let i = 1; i < parts.length; i++) {
                const nodeName = parts[i];
                
                // Check if child already exists
                let child = currentNode.children.find(c => c.id === nodeName);

                if (!child) {
                    child = { 
                        id: nodeName, 
                        children: [],
                        // If it's the last item in parts, it's a Leaf (Witness)
                        isLeaf: (i === parts.length - 1) 
                    };
                    currentNode.children.push(child);
                }

                currentNode = child;
            }
        }
    }

    /**
     * Recursive calculation engine.
     * Rule: Combine Siblings (Parallel) -> Then Attenuate (Serial)
     */
    computeNode(node) {
        // BASE CASE: Leaf Node (Witness)
        // A leaf node represents a transmitter recording the event from an implicit receiver.
        // It starts with the integrity of that first hop (the decay factor).
        if (!node.children || node.children.length === 0) {
            return this.decay;
        }

        // RECURSIVE STEP 1: Calculate all children first
        const childValues = node.children.map(child => this.computeNode(child));

        // RECURSIVE STEP 2: Parallel Combination (Noisy-OR)
        // Formula: 1 - product(1 - childValue)
        let inverseProduct = 1.0;
        for (const val of childValues) {
            inverseProduct *= (1.0 - val);
        }
        const combinedLI = 1.0 - inverseProduct;

        // RECURSIVE STEP 3: Serial Attenuation (The Bottleneck)
        // If this is the Source (Root), it does not attenuate itself (it IS the truth).
        // Otherwise, the node itself acts as a filter, multiplying by the decay.
        if (node.isSource) {
            return combinedLI;
        } else {
            return combinedLI * this.decay;
        }
    }

    /**
     * Debug helper to see the parsed tree structure
     */
    getTree() {
        return this.tree;
    }
}

// --- Export for Node.js or Browser ---
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntegrityCalculator;
}

const calculator = new IntegrityCalculator(0.6); // Set decay to 0.6

const hadithChains = [
    'Source > A > B > C',
    'Source > A > B > D',
    'Source > A > E > F',
    'Source > G > H > I > J',
    'Source > G > H > I > K',
    'Source > G > H > I > L'
];

const result = calculator.calculate(hadithChains);

console.log(`Final Integrity Score: ${(result * 100).toFixed(4)}%`);
// Output should be roughly: 52.89%

const calculator2 = new IntegrityCalculator(0.6); // Set decay to 0.6

const hadithChains2 = ['Prophet Muhammad PBUH > Companion 1 > Transmitter A > Transmitter B > Transmitter C',
'Prophet Muhammad PBUH > Companion 1 > Transmitter A > Transmitter B > Transmitter D',
'Prophet Muhammad PBUH > Companion 1 > Transmitter A > Transmitter B > Transmitter E',
'Prophet Muhammad PBUH > Companion 2 > Transmitter F > Transmitter G',
'Prophet Muhammad PBUH > Companion 2 > Transmitter H > Transmitter I > Transmitter J > Transmitter K'];
//const hadithChains2 = [ 'Prophet Muhammad PBUH > Companion 2 > Transmitter H > Transmitter I'];


const result2 = calculator2.calculate(hadithChains2);

console.log(`Final Integrity Score: ${(result2 * 100).toFixed(4)}%`);
// Output should be roughly: 41.42%
