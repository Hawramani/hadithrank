
/* HadithRank Algorithm */
/* Copyright (c) 2025 Ikram Hawramani */
/* MIT License with Algorithm Attribution */

class IntegrityCalculator {
    constructor(defaultDecay = 0.6) {
        this.decay = defaultDecay;
        this.tree = { id: 'Source', children: [], isSource: true };
    }

    /**
     * Main entry point: Calculates the final system LI.
     * @param {string[]} chains - Array of strings like "Source > A > B (0.3) > C"
     * @returns {number} - The final calculated probability (0.0 to 1.0)
     */
    calculate(chains) {
        this.buildTree(chains);
        return this.computeNode(this.tree);
    }

    /**
     * Parses text chains into a hierarchical tree structure.
     * Extracts custom fidelity values if present, e.g., "Name (0.8)"
     */
    buildTree(chains) {
        // Reset tree
        this.tree = { id: 'Source', children: [], isSource: true };

        for (const chainStr of chains) {
            // Split string by ' > ' or any variation of arrows/spaces
            const parts = chainStr.split(/\s*>\s*/);
            
            let currentNode = this.tree;

            // Start from index 1 because index 0 is always 'Source'
            for (let i = 1; i < parts.length; i++) {
                const rawPart = parts[i];
                
                // Parse Name and Custom Fidelity
                // Matches "Name" or "Name (0.5)"
                let nodeName = rawPart.trim();
                let customFidelity = null;

                // Regex to find parenthetical number at end of string
                const match = nodeName.match(/^(.*?)\s*\((\d+(?:\.\d+)?)\)$/);
                if (match) {
                    nodeName = match[1].trim();     // The name "B"
                    customFidelity = parseFloat(match[2]); // The value 0.3
                }
                
                // Find existing child or create new one
                let child = currentNode.children.find(c => c.id === nodeName);

                if (!child) {
                    child = { 
                        id: nodeName, 
                        children: [],
                        isLeaf: (i === parts.length - 1)
                    };
                    currentNode.children.push(child);
                }
                
                // If this specific chain mention had a custom fidelity, update the node
                if (customFidelity !== null) {
                    child.customFidelity = customFidelity;
                }

                currentNode = child;
            }
        }
    }

    /**
     * Recursive calculation engine.
     * Logic: 
     * 1. If Leaf: Return custom fidelity OR default decay.
     * 2. If Branch: Combine children (Parallel) -> Attenuate by Node fidelity (Serial).
     */
    computeNode(node) {
        // Determine this node's specific attenuation factor
        // Use custom fidelity if set, otherwise use global default
		// And use global default if custom fidelity is higher than the default,
		// as this implies a fundamental misunderstanding of the algorithm
		// (the default should represent a "law of nature" that cannot be
		// sidestepped)
        const nodeFidelity = (node.customFidelity !== undefined && node.customFidelity <= this.decay) 
                             ? node.customFidelity 
                             : this.decay;
							 

        // BASE CASE: Leaf Node (Witness)
        // Represents the hop from the Implicit Receiver -> Witness
        if (!node.children || node.children.length === 0) {
            return nodeFidelity;
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
        // The Source (Root) is Truth (1.0) and does not attenuate.
        // All other nodes multiply the incoming combined signal by their fidelity.
        if (node.isSource) {
            return combinedLI;
        } else {
            return combinedLI * nodeFidelity;
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntegrityCalculator;
}


const calculator = new IntegrityCalculator(); 

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




const calculator2 = new IntegrityCalculator();

const hadithChains2 = ['Prophet Muhammad PBUH > Companion 1 > Transmitter A > Transmitter B > Transmitter C',
'Prophet Muhammad PBUH > Companion 1 > Transmitter A > Transmitter B > Transmitter D',
'Prophet Muhammad PBUH > Companion 1 > Transmitter A > Transmitter B > Transmitter E',
'Prophet Muhammad PBUH > Companion 2 > Transmitter F > Transmitter G',
'Prophet Muhammad PBUH > Companion 2 > Transmitter H > Transmitter I > Transmitter J > Transmitter K'];

const result2 = calculator2.calculate(hadithChains2);

console.log(`Final Integrity Score: ${(result2 * 100).toFixed(4)}%`);
// Output should be roughly: 41.42%


const calculator3 = new IntegrityCalculator();
/*
 The values for less-reliable-than-default transmitters should ideally follow
 standardized criteria, and they could also be based on:
	1. Additional data provided by other empirical analyses of hadiths and their transmitters.
	2. Probabilistic criteria derived from the jarh literature: get the transmitter's reliability based on what the top scholars say about them (the exact words a scholar uses may serve as important indicators of the scholars' attitude towards the transmitter), a kind of averaging of their opinions, perhaps with some scholars given more weight.
 */
 
const hadithChains3 = ['Prophet Muhammad ﷺ > Reliable A > Lower-Quality Reliable Transmitter B (0.45) > Reliable C',
'Prophet Muhammad ﷺ > Reliable D > Half-Reliable Transmitter E (0.3) > Reliable F',
'Prophet Muhammad ﷺ > Reliable D > Questionable But Not Daif Transmitter G (0.2) > Reliable H'];

const result3 = calculator3.calculate(hadithChains3);

console.log(`Final Integrity Score: ${(result3 * 100).toFixed(4)}%`);
// Output should be roughly: 30.198%
