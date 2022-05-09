// I have, foolishly, made this for no reason. It is here now, deal with it.

module.exports = {
    Node,
    BinarySearchTree
}

class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    /* Data Insertion */

    // Create a new node and insert it.
    insert(data) {
        let newNode = new Node(data);

        if (this.root === null) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    // Search for an empty space in the tree to insert a new node.
    insertNode(node, newNode) {
        if (newNode.data < node.data) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    /* Data Removal */

    // Find this data and remove it from the node tree
    remove(data) {
        this.root = this.removeNode(this.root, data);
    }

    removeNode(node, key) {
        // If node is null, then tree is empty, return null.
        if (node === null) {
            return null;
        } else if (key < node.data) { // If data to delete is less than roots data, move to left of tree
            node.left = this.removeNode(node.left, key);
            return node;
        } else if (key > node.data) { // If data to delete is more than roots data, move to right of tree
            node.right = this.removeNode(node.right, key);
        } else { // Data is similar to roots data. Delete this node.
            if (node.left === null && node.right === null) {
                node = null;
                return node;
            }

            if (node.left === null) {
                node = node.right;
                return node;
            } else if (node.right === null) {
                node = node.left;
                return node;
            }

            let aux = this.findMinNode(node.right);
            node.data = aux.data;

            node.right = this.removeNode(node.right, aux.data);
            return node;
        }
    }

    /* Tree Traversal */
    inorderPrint(node) {
        if (node !== null) {
            this.inorderPrint(node.left);
            console.log(node.data);
            this.inorderPrint(node.right);
        }
    }

    preorderPrint(node) {
        if (node !== null) {
            console.log(node.data);
            this.preorderPrint(node.left);
            this.preorderPrint(node.right);
        }
    }

    postorderPrint(node) {
        if (node !== null) {
            this.postorderPrint(node.left);
            this.postorderPrint(node.right);
            console.log(node.data);
        }
    }

    /* Helper Methods */

    // Finds the minimum node in the tree
    findMinNode(node) {
        if (node.left === null) {
            return node;
        } else {
            return this.findMinNode(node.left);
        }
    }

    // Returns root of the tree
    getRootNode() {
        return this.root;
    }

    search(node, data) {
        // If tree is empty return null
        if (node === null) {
            return null;
        } else if (data < node.data) {
            // Data is less than node data, move left
            return this.search(node.left, data);
        } else if (data > node.data) {
            // Data is more than node data, move right
            return this.search(node.right, data);
        } else {
            return node;
        }
    }
}