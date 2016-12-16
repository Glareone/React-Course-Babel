require("./style.css");
var styles = require("./styles.js");

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
    else if(isInlineStyleChanged(newNode, oldNode)){
      // copy inline style because string is immutable
      newNode.props.style = "" + oldNode.props.style;
      //check all kids
      const newLength = newNode.children.length;
      const oldLength = oldNode.children.length;
      for (let i = 0; i < newLength || i < oldLength; i++) {
        updateElement(parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
      }
    }
    else if(isStyleClassChanged(newNode, oldNode)){
      // reference to new style
      newNode.props.className = oldNode.props.className;

      //check all kids
      const newLength = newNode.children.length;
      const oldLength = oldNode.children.length;
      for (let i = 0; i < newLength || i < oldLength; i++) {
        updateElement(parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
      }
    }
    else if (newNode.type) {
      //only check kids, no changes in this element
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

function isInlineStyleChanged(node1, node2) {
  if(typeof node1 == 'object' && typeof node2 == 'object'){

    let style1 = node1.props.style;
    let style2 = node2.props.style;

    if(!style1 || !style2){
      return true;
    }
    // if 0 then changed
    let comp = (style1.toString()).localeCompare(style2.toString());
    return comp === 0;
  }
    return false;
}

function isStyleClassChanged(newNode,oldNode) {
  if(typeof newNode == 'object' && typeof oldNode == 'object' && (newNode.props.className || oldNode.props.className) ){
    return JSON.stringify(newNode) === JSON.stringify(oldNode);
  }
  return false;
}

const dom1 = (<ul id="1">
                <li id="2" className={styles.DOMstyles.liClass1} style={styles.DOMstyles.liStyle1}>item 1</li>
                <li id="3" className={styles.DOMstyles.liClass2}>item 2</li>
                <li id="4" className={styles.DOMstyles.liClass2} style={styles.DOMstyles.liStyle3}>item 3</li>
                <li id="5">item 4</li>
                <li id="6"><div>div 5</div></li>
              </ul>);

const dom2 = (<ul id="1">
                <li id="2"  className={styles.DOMstyles.liClass1} style={styles.DOMstyles.liStyle2}>item 1</li>
                <li id="3">some change</li>
                <li id="4" className={styles.DOMstyles.liClass2} style={styles.DOMstyles.liStyle3}>item 3</li>
                <li id="5">new item 4 without changing style but new tag</li>
                <li id="6"><div>div 5</div></li>
              </ul>);

const $root = document.getElementById('root');
const $button = document.getElementById('button');

updateElement($root, dom1);

$button.addEventListener('click', () => {
  updateElement($root, dom2, dom1);
});
