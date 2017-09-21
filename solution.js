function drawNestedSetsTree(data, domNode) {

  const domRoot = document.createElement('UL');
  const reduce = data => {

    const append = (dom, node) => {
      let el = document.createElement('LI');
      // el.setAttribute("draggable", "true");
      el.addEventListener("dblclick", (e) => {
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

      // el.addEventListener("drag", (e) => {
      //   console.log(e.target);
      //   e.DataTransfer.setData("object", e.target);
      //   e.stopPropagation();
      // }, false);
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
    return trueroot;
  };

  var root = reduce(data);
  return {
    save: () => {
      console.log("save");
    }
  };
}
