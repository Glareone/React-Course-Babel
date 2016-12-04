require("./style.css")
// const PI = 3.141593;
// document.write("it works");
// document.write(require("./content.js"));


/** @jsx createVirtualNode */
function createVirtualNode(type, props, ...children) {
  return { type, props, children };
}

function createElement(node) {
   if (typeof node === 'string') {
       return document.createTextNode(node);
   }

   const $element = document.createElement(node.type);
   node.children.map(createElement)
                .forEach($element.appendChild.bind($element));

   return $element;
}

function updateElement(parent, newNode, oldNode, index = 0) {
    if (!oldNode) {
      parent.appendChild(createElement(newNode));
    }
    else if (!newNode) {
      parent.removeChild(parent.childNodes[index]);
    }
    else if (isChanged(newNode, oldNode)) {
      parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    }
    else if (newNode.type) {
      const newLength = newNode.children.length;
      const oldLength = oldNode.children.length;

      for (let i = 0; i < newLength || i < oldLength; i++) {
        updateElement(parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
      }
    }
}

function isChanged(node1, node2) {
  return typeof node1 !== typeof node2
      || typeof node1 === 'string' && node1 !== node2
      || node1.type !== node2.type
}


const dom1 = "<ul><li>item 1</li><li>item 2</li></ul>";

const dom2 = "<ul><li>item 1</li><li>some change</li></ul>";

const $root = document.getElementById('root');
const $button = document.getElementById('button');

updateElement($root, dom1);

$button.addEventListener('click', () => {
  updateElement($root, dom2, dom1);
});
