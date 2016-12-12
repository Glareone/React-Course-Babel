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
    else if (isChanged(newNode, oldNode) || isInlineStyleChanged(newNode, oldNode)) {
      parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    }
    //else if (!isChanged(newNode, oldNode) && isInlineStyleChanged(newNode, oldNode)){
      //oldNode.props.style = newNode.props.style;
      //oldNode.removeAttr('style');
      //oldNode.style.cssText = document.defaultView.getComputedStyle(newNode, "").cssText;
    //}
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

function isInlineStyleChanged(node1, node2) {
  if( typeof node1 !== 'string' && typeof node2 !== 'string'){

    //var element1 = document.getElementById(node1.props.style);
    //var element2 = document.getElementById(node2.props.id);

    var style1 = node1.props.style;
    var style2 = node2.props.style;

    //var style1 = window.getComputedStyle(element1, null).cssText;
    //var style1 = node1.style;
    //var style2 = window.getComputedStyle(element2, null).cssText;
    //var style2 = node2.style;
    return style1 != style2;
  }
    return false;
}

const ulStyle1 = { width : '100px'};
const ulStyle2 = { width : '150px'};
const liStyle1 = { border: '1px solid #ccc'};
const liStyle2 = { border: '1px solid #aaa'};

const dom1 = (<ul id="1"><li id="2" style={liStyle1}>item 1</li><li id="3">item 2</li></ul>);

const dom2 = (<ul id="1"><li id="2" style={liStyle2}>item 1</li><li id="3">some change</li></ul>);

const $root = document.getElementById('root');
const $button = document.getElementById('button');

updateElement($root, dom1);

$button.addEventListener('click', () => {
  updateElement($root, dom2, dom1);
});
