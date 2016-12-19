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
    if(!oldNode) {
      parent.appendChild(createElement(newNode));
      return;
    }
    if(!newNode) {
      parent.removeChild(parent.childNodes[index]);
      return;
    }
    if(isChanged(newNode, oldNode)) {
        parent.replaceChild(createElement(newNode), parent.childNodes[index]);
        return;
    }
    if(isInlineStyleChanged(newNode, oldNode)){
      // copy inline style because string is immutable
      newNode.props.style = "" + oldNode.props.style;
      // set new Id
      newNode.props.id = "" + oldNode.props.id;
      console.log('inline style changed');
    }
    if(isStyleClassChanged(newNode, oldNode)){
      // reference to new style
      newNode.props.className = oldNode.props.className;

      console.log('style Class changed');
    }
    if (newNode.type) {
      //check kids after checking inlineStyles and ClassName
      const newLength = newNode.children.length;
      const oldLength = oldNode.children.length;
      for (let i = 0; i < newLength || i < oldLength; i++) {
        updateElement(parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
      }
      return;
    }
}

function isChanged(node1, node2) {
  return typeof node1 !== typeof node2
      || typeof node1 === 'string' && node1 !== node2
      || node1.type !== node2.type
}

function isInlineStyleChanged(node1, node2) {
  // if both is not objests
  if(typeof node1 !== 'object' && typeof node2 !== 'object'){
    return false;
  }

  let style1 = node1.props !== undefined && node1.props !== null ? JSON.stringify(node1.props.style) : undefined;
  let style2 = node2.props !== undefined && node1.props !== null ? JSON.stringify(node2.props.style) : undefined;

    // if 2 objects don't have styles
  if(style1 == undefined && style2 == undefined){
    return false;
  }

    // if 2 objects
  if(style1 == undefined || style2 == undefined){
    return true;
  }

  return (style1 > style2 || style1 < style2);
}

function isStyleClassChanged(newNode,oldNode) {
  if(typeof newNode == 'object' && typeof oldNode == 'object' && (newNode.props || oldNode.props) ){
    if(!newNode.props.className || !oldNode.props.className){
      return true;
    }
    return JSON.stringify(newNode.props.className) === JSON.stringify(oldNode.props.className);
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
                <li id="4" className={styles.DOMstyles.liClass3} style={styles.DOMstyles.liStyle3}>item 3</li>
                <li id="5">new item 4 without changing style but new tag</li>
                <li id="6"><div>div 6</div></li>
              </ul>);

const $root = document.getElementById('root');
const $button = document.getElementById('button');

updateElement($root, dom1);

$button.addEventListener('click', () => {
  updateElement($root, dom2, dom1);
});
