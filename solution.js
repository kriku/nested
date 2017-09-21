/* function build tree structure from nested set
 * create DOM-tree from data, append tree to domNode
 */
function drawNestedSetsTree(data, domNode) {

  const domRoot = document.createElement('UL');

  const generator = (prefix) => {
    let id = 0;
    return () => (prefix + id++);
  };

  /* traversing set model, construct tree structure */
  const reduce = data => {
    id = generator('draggable_');

    /* function has side effects on node argument
     * create LI element, append to DOM,
     * effects on node.dom and node.truedom values
     * also addEventListener on dblclick and d'n'd
     */
    const append = (dom, node) => {
      let el = document.createElement('LI');

      el.addEventListener('dblclick', (e) => {
        let parent = e.target.parentNode;
        let ul = e.target.childNodes[1];
        if (ul) {
          let children = ul.childNodes;
          for (let i=children.length;i>0;i) {
            parent.appendChild(children[--i]);
          }
        }
        parent.removeChild(e.target);
        e.stopPropagation();
      }, false);

      el.setAttribute('id', id());
      el.setAttribute('draggable', 'true');
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.stopPropagation();
      }, false);

      // could be changed to UL
      node.dom = el;
      node.truedom = el;
      el.innerText = node.title;
      dom.appendChild(el);
      return el;
    };

    let root = {
      parent: null,
      dom: domRoot,
      truedom: domRoot,
      left: Number.NEGATIVE_INFINITY,
      right: Number.POSITIVE_INFINITY,
      children: []
    };
    let trueroot = root;

    data.sort((a, b) => (a.left - b.left));
    // current dom structure
    let dom = domRoot;

    data.forEach((node) => {
      while (root.right < node.left && root.parent) {
        root = root.parent;
        dom = root.dom;
      }
      if (root.left < node.left && node.right < root.right) {
        node.parent = root;

        if (!root.children) {
          root.children = [];
          var children = document.createElement('UL');
          root.dom.appendChild(children);
          dom = children;
          root.dom = dom;
        }

        root.children.push(node);
        let newDom = append(dom, node);
        root = node;
        dom = newDom;
      }
    });

    domNode.appendChild(domRoot);

    let dragged;

    /* events fired on the draggable target
     * https://developer.mozilla.org/en-US/docs/Web/Events/drag
     */
    document.addEventListener('drag', e => {
      console.log('drag ' + e.target);
      dragged = e.target;
      e.target.style.opacity = .5;
    }, false);

    document.addEventListener('dragend', e => {
        e.target.style.opacity = '';
    }, false);

    document.addEventListener('dragover', e => {
        e.preventDefault();
    }, false);

    document.addEventListener('drop', e => {
      console.log('drop ', e.target.childNodes);
      e.preventDefault();
      let ul = e.target.childNodes[1];
      if (!ul) {
        ul = document.createElement('UL');
        e.target.appendChild(ul);
      }
      dragged.parentNode.removeChild(dragged);
      ul.appendChild(dragged);
    }, false);

    return trueroot;
  };

  var root = reduce(data);
  return {
    save: () => {
      let index = generator(0);
      let nested = [];
      // recursive function for tree traversal
      let findli = (root) => {
        let left, right;
        let children = root.childNodes;
        // count index only on special leaves
        if (root.nodeName == 'LI') {
          left = index();
        }
        // dfs traversing:
        for (let i=0, len=children.length; i < len; i++) {
          findli(children[i]);
        }
        // special leaves
        if (root.nodeName == 'LI') {
          right = index();
          let entity = {
            "title": root.childNodes[0].nodeValue,
            "left" : left,
            "right": right
          };
          nested.push(entity);
        }
        return JSON.stringify(nested);
      };
      return findli(domRoot);
    }
  };
}
