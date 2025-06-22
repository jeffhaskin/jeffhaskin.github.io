// Math Flow Tool script
window.addEventListener('DOMContentLoaded', () => {
  const {
    ReactFlow,
    ReactFlowProvider,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Handle,
    Position
  } = window.ReactFlow;

  const initialNodes = [];
  const initialEdges = [];

  function NumberNode({ id, data }) {
    const onChange = (evt) => {
      data.number = evt.target.value;
      data.update();
    };
    return React.createElement(
      'div',
      { className: 'number-node' },
      React.createElement(window.ReactFlow.Handle, { type: 'source', position: window.ReactFlow.Position.Right, id: 'out' }),
      React.createElement('input', { type: 'number', step: '0.00000001', value: data.number || '', onChange })
    );
  }

  function OperationNode({ id, data }) {
    const onOpChange = (e) => {
      data.operation = e.target.value;
      data.update();
    };
    return React.createElement(
      'div',
      { className: 'operation-node' },
      React.createElement(window.ReactFlow.Handle, { type: 'target', position: window.ReactFlow.Position.Left, id: 'a' }),
      React.createElement(window.ReactFlow.Handle, { type: 'target', position: window.ReactFlow.Position.Left, id: 'b', style: { top: '70%' } }),
      React.createElement('select', { value: data.operation, onChange: onOpChange },
        React.createElement('option', { value: 'add' }, 'Add'),
        React.createElement('option', { value: 'sub' }, 'Subtract'),
        React.createElement('option', { value: 'mul' }, 'Multiply'),
        React.createElement('option', { value: 'div' }, 'Divide'),
        React.createElement('option', { value: 'sqrt' }, 'Square Root')
      ),
      React.createElement('div', null, data.value !== undefined ? data.value : '') ,
      React.createElement(window.ReactFlow.Handle, { type: 'source', position: window.ReactFlow.Position.Right, id: 'out' })
    );
  }

  function DisplayNode({ id, data }) {
    return React.createElement(
      'div',
      { className: 'display-node' },
      React.createElement(window.ReactFlow.Handle, { type: 'target', position: window.ReactFlow.Position.Left, id: 'in' }),
      React.createElement('div', null, data.value !== undefined ? data.value : ''),
      React.createElement(window.ReactFlow.Handle, { type: 'source', position: window.ReactFlow.Position.Right, id: 'out' })
    );
  }

  const nodeTypes = {
    number: NumberNode,
    operation: OperationNode,
    display: DisplayNode
  };

  function Flow() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const addNode = (type) => {
      const id = `${type}-${nodes.length + 1}-${Date.now()}`;
      const newNode = { id, type, position: { x: 250, y: 25 }, data: { update: compute } };
      if (type === 'number') newNode.data.number = 0;
      if (type === 'operation') newNode.data.operation = 'add';
      setNodes((nds) => nds.concat(newNode));
    };

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    function compute() {
      const values = {};
      nodes.forEach((n) => {
        if (n.type === 'number') {
          values[n.id] = parseFloat(n.data.number) || 0;
        }
      });
      let progress = true;
      while (progress) {
        progress = false;
        nodes.forEach((n) => {
          if (values[n.id] === undefined) {
            if (n.type === 'operation') {
              const aEdge = edges.find((e) => e.target === n.id && e.targetHandle === 'a');
              const bEdge = edges.find((e) => e.target === n.id && e.targetHandle === 'b');
              const av = aEdge ? values[aEdge.source] : undefined;
              const bv = bEdge ? values[bEdge.source] : undefined;
              if (av !== undefined && (bv !== undefined || n.data.operation === 'sqrt')) {
                let result = 0;
                switch (n.data.operation) {
                  case 'add': result = av + bv; break;
                  case 'sub': result = av - bv; break;
                  case 'mul': result = av * bv; break;
                  case 'div': result = bv !== 0 ? av / bv : 0; break;
                  case 'sqrt': result = Math.sqrt(av); break;
                }
                values[n.id] = parseFloat(result.toFixed(8));
                progress = true;
              }
            } else if (n.type === 'display') {
              const inEdge = edges.find((e) => e.target === n.id && e.targetHandle === 'in');
              const v = inEdge ? values[inEdge.source] : undefined;
              if (v !== undefined) {
                values[n.id] = v;
                progress = true;
              }
            }
          }
        });
      }
      setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, value: values[n.id], update: compute, number: n.data.number, operation: n.data.operation } })));
    }

    const exportFlow = () => {
      const data = JSON.stringify({ nodes, edges });
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'math-flow.json';
      a.click();
      URL.revokeObjectURL(url);
    };

    const importFlow = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const obj = JSON.parse(reader.result);
          if (obj.nodes && obj.edges) {
            setNodes(obj.nodes.map(n => ({ ...n, data: { ...n.data, update: compute } })));
            setEdges(obj.edges);
          }
        } catch (err) {
          console.error('Invalid JSON');
        }
      };
      reader.readAsText(file);
    };

    return React.createElement(
      ReactFlowProvider,
      null,
      React.createElement('div', { className: 'toolbar' },
        React.createElement('button', { onClick: () => addNode('number') }, 'Add Number'),
        React.createElement('button', { onClick: () => addNode('operation') }, 'Add Operation'),
        React.createElement('button', { onClick: () => addNode('display') }, 'Add Display')
      ),
      React.createElement('div', { className: 'import-export' },
        React.createElement('input', { type: 'file', id: 'importFile', style: { display: 'none' }, onChange: importFlow }),
        React.createElement('button', { onClick: () => document.getElementById('importFile').click() }, 'Import'),
        React.createElement('button', { onClick: exportFlow }, 'Export')
      ),
      React.createElement(ReactFlow, {
        nodes: nodes,
        edges: edges,
        onNodesChange: onNodesChange,
        onEdgesChange: onEdgesChange,
        onConnect: onConnect,
        nodeTypes: nodeTypes,
        onMoveEnd: compute,
        className: 'math-flow-container'
      },
        React.createElement(Background, { color: '#aaa', gap: 16 }),
        React.createElement(MiniMap, null),
        React.createElement(Controls, null)
      )
    );
  }

  ReactDOM.render(React.createElement(Flow), document.getElementById('root'));
});
