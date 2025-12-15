// CompactFlowConfig.js - 适配浏览器环境
// 1. 复用全局组件和工具
const { Card, CardContent, Button, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogHeader, DialogTitle } = window.CommonComponents;
const { $r } = window; // React.createElement 快捷方式

// 2. 图标映射（适配全局Lucide）
const ICON_MAP = {
  CheckSquare: 'check-square',
  FileText: 'file-text',
  Clock: 'clock',
  CheckCircle: 'check-circle',
  XCircle: 'x-circle',
  Box: 'box',
  Radio: 'radio',
  UserCircle: 'user-circle',
  Calendar: 'calendar',
  AlertCircle: 'alert-circle',
  MapPin: 'map-pin',
  Image: 'image',
  Users: 'users',
  Hash: 'hash',
  Target: 'target',
  Plus: 'plus',
  Edit: 'edit',
  Trash2: 'trash-2',
  GripVertical: 'grip-vertical'
};

// 3. 常量定义（保持不变）
const HANDLER_OPTIONS = [
  { value: "initiator", label: "Initiator" },
  { value: "current", label: "Current Handler" }
];

const FLOW_NODES = [
  { id: "draft", name: "Draft", icon: "file-text", color: "#94A3B8" },
  { id: "pending", name: "Pending", icon: "clock", color: "#F59E0B" },
  { id: "done", name: "Done", icon: "check-circle", color: "#10B981" },
  { id: "cancelled", name: "Cancelled", icon: "x-circle", color: "#EF4444" }
];

const ACTION_TYPES = [
  { id: "save", name: "Save", color: "#94A3B8" },
  { id: "submit", name: "Submit", color: "#3B82F6" },
  { id: "approve", name: "Approve", color: "#10B981" },
  { id: "reject", name: "Reject", color: "#EF4444" },
  { id: "rollback", name: "Rollback", color: "#F59E0B" },
  { id: "cancel", name: "Cancel", color: "#6B7280" }
];

// 4. 模拟API和React Query（浏览器环境替代）
const base44 = window.base44 || {
  entities: {
    Task: {
      filter: async () => [], // 模拟空数据，可替换为实际接口
      update: async (id, data) => data
    },
    Role: {
      list: async () => [] // 模拟空角色列表
    }
  }
};

// 简化React Query（浏览器环境）
const useQuery = ({ queryKey, queryFn }) => {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    queryFn().then(res => setData(res));
  }, []);
  return { data };
};

const useMutation = ({ mutationFn, onSuccess }) => {
  return {
    mutate: async (params) => {
      const res = await mutationFn(params);
      onSuccess && onSuccess(res);
    }
  };
};

const useQueryClient = () => ({
  invalidateQueries: () => {}
});

// 5. 核心组件
function CompactFlowConfigComponent() {
  const queryClient = useQueryClient();
  
  // 数据查询
  const { data: tasks = [] } = useQuery({
    queryKey: ['taskConfigs'],
    queryFn: async () => {
      const configs = await base44.entities.Task.filter({ status: undefined });
      return configs;
    },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => base44.entities.Role.list(),
  });
  
  // 状态管理
  const [isNodeDialogOpen, setIsNodeDialogOpen] = React.useState(false);
  const [editingNodeIndex, setEditingNodeIndex] = React.useState(null);
  const [selectedTaskId, setSelectedTaskId] = React.useState(null);
  const [nodeFormData, setNodeFormData] = React.useState({
    id: "",
    currentHandler: "",
    modules: [],
    actions: [],
    ccRoles: []
  });
  const [showCCConfig, setShowCCConfig] = React.useState(false);

  // 提交逻辑
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskConfigs'] });
      setIsNodeDialogOpen(false);
    },
  });

  const handleNodeSubmit = () => {
    const task = tasks.find(t => t.id === selectedTaskId);
    const flowConfig = task?.flow_config || { nodes: [] };
    
    const updatedNodes = [...flowConfig.nodes];
    if (editingNodeIndex !== null) {
      updatedNodes[editingNodeIndex] = nodeFormData;
    } else {
      updatedNodes.push(nodeFormData);
    }

    updateMutation.mutate({
      id: selectedTaskId,
      data: { ...task, flow_config: { ...flowConfig, nodes: updatedNodes } }
    });
    
    setIsNodeDialogOpen(false);
    setNodeFormData({ id: "", currentHandler: "", modules: [], actions: [], ccRoles: [] });
    setEditingNodeIndex(null);
  };

  const handleDeleteNode = (taskId, nodeIndex) => {
    const task = tasks.find(t => t.id === taskId);
    const flowConfig = task?.flow_config || { nodes: [] };
    const updatedNodes = flowConfig.nodes.filter((_, i) => i !== nodeIndex);
    
    updateMutation.mutate({
      id: taskId,
      data: { ...task, flow_config: { ...flowConfig, nodes: updatedNodes } }
    });
  };

  const openNodeDialog = (taskId, nodeIndex = null) => {
    setSelectedTaskId(taskId);
    const task = tasks.find(t => t.id === taskId);
    const flowConfig = task?.flow_config || { nodes: [] };
    
    if (nodeIndex !== null) {
      setEditingNodeIndex(nodeIndex);
      setNodeFormData(flowConfig.nodes[nodeIndex]);
    } else {
      setEditingNodeIndex(null);
      setNodeFormData({ id: "", currentHandler: "", modules: [], actions: [], ccRoles: [] });
    }
    setIsNodeDialogOpen(true);
  };

  const getNodeInfo = (nodeId) => {
    return FLOW_NODES.find(n => n.id === nodeId) || FLOW_NODES[0];
  };

  // 6. 渲染逻辑（替换所有JSX为React.createElement）
  return $r('div', { className: 'space-y-3' },
    // 标题栏
    $r('div', { className: 'flex justify-between items-center' },
      $r('h3', { className: 'text-sm font-semibold' }, 'Flow Configuration')
    ),

    // 任务列表
    tasks.map((task) => {
      const flow = task.flow_config || { nodes: [] };
      return $r(Card, { key: task.id, className: 'border' },
        $r(CardContent, { className: 'p-2' },
          // 任务头部
          $r('div', { className: 'flex items-center justify-between mb-2' },
            $r('div', null,
              $r('h4', { className: 'font-medium text-sm' }, task.name),
              $r('p', { className: 'text-xs text-gray-500' }, `${flow.nodes.length} steps`)
            ),
            $r(Button, { 
              size: "sm", 
              variant: "ghost", 
              className: "h-7 w-7 p-0",
              onClick: () => openNodeDialog(task.id)
            },
              $r(window.CommonComponents.Icon, { name: ICON_MAP.Plus, size: 12 })
            )
          ),

          // 节点列表
          $r('div', { className: 'flex flex-wrap gap-1' },
            flow.nodes.map((node, index) => {
              const nodeInfo = getNodeInfo(node.id);
              return $r(Card, { key: index, className: 'border text-xs', style: { borderColor: nodeInfo.color } },
                $r(CardContent, { className: 'p-1.5' },
                  $r('div', { className: 'flex items-center gap-1' },
                    $r(window.CommonComponents.Icon, { 
                      name: nodeInfo.icon, 
                      size: 12,
                      style: { color: nodeInfo.color }
                    }),
                    $r('div', null,
                      $r('div', { className: 'font-medium' }, nodeInfo.name),
                      node.currentHandler && $r('div', { className: 'text-gray-500 text-xs' }, `Handler: ${node.currentHandler}`)
                    ),
                    $r('div', { className: 'flex gap-0.5 ml-1' },
                      $r(Button, { 
                        size: "sm", 
                        variant: "ghost", 
                        onClick: () => openNodeDialog(task.id, index),
                        className: "h-5 w-5 p-0"
                      },
                        $r(window.CommonComponents.Icon, { name: ICON_MAP.Edit, size: 10 })
                      ),
                      $r(Button, { 
                        size: "sm", 
                        variant: "ghost", 
                        onClick: () => handleDeleteNode(task.id, index),
                        className: "h-5 w-5 p-0"
                      },
                        $r(window.CommonComponents.Icon, { name: ICON_MAP.Trash2, size: 10 })
                      )
                    )
                  )
                )
              );
            })
          )
        )
      );
    }),

    // 节点编辑弹窗
    $r(Dialog, { open: isNodeDialogOpen, onOpenChange: setIsNodeDialogOpen },
      $r(DialogContent, { className: 'max-w-2xl max-h-[90vh] overflow-y-auto' },
        $r(DialogHeader, null,
          $r(DialogTitle, { className: 'text-base' }, editingNodeIndex !== null ? "Edit Step" : "Add Step")
        ),
        $r('div', { className: 'space-y-3' },
          // 步骤类型选择
          $r('div', null,
            $r(Label, { className: 'text-xs' }, 'Step Type'),
            $r(Select, {
              value: nodeFormData.id,
              onValueChange: (value) => setNodeFormData({ ...nodeFormData, id: value })
            },
              $r(SelectTrigger, { className: 'text-xs' },
                $r(SelectValue, { placeholder: "Select step" })
              ),
              $r(SelectContent, null,
                FLOW_NODES.map(node => 
                  $r(SelectItem, { key: node.id, value: node.id },
                    $r('div', { className: 'flex items-center gap-2' },
                      $r(window.CommonComponents.Icon, { 
                        name: node.icon, 
                        size: 12,
                        style: { color: node.color }
                      }),
                      $r('span', { className: 'text-xs' }, node.name)
                    )
                  )
                )
              )
            )
          ),

          // 当前处理人
          $r('div', null,
            $r(Label, { className: 'text-xs' }, 'Current Handler'),
            $r(Select, {
              value: nodeFormData.currentHandler,
              onValueChange: (value) => setNodeFormData({ ...nodeFormData, currentHandler: value })
            },
              $r(SelectTrigger, { className: 'text-xs' },
                $r(SelectValue, { placeholder: "Select role" })
              ),
              $r(SelectContent, null,
                $r(SelectItem, { value: "initiator" }, "Initiator"),
                $r(SelectItem, { value: "current" }, "Current Handler"),
                roles.map(role => 
                  $r(SelectItem, { key: role.id, value: role.name }, role.name)
                )
              )
            )
          ),

          // 操作按钮
          $r('div', null,
            $r(Label, { className: 'text-xs' }, 'Action Buttons'),
            $r('div', { className: 'grid grid-cols-3 gap-1 mt-1' },
              ACTION_TYPES.map(action => {
                const isSelected = nodeFormData.actions?.some(a => a.id === action.id);
                return $r(Button, {
                  key: action.id,
                  type: "button",
                  size: "sm",
                  variant: isSelected ? "default" : "outline",
                  className: "h-8 text-xs",
                  onClick: () => {
                    const actions = nodeFormData.actions || [];
                    if (isSelected) {
                      setNodeFormData({ 
                        ...nodeFormData, 
                        actions: actions.filter(a => a.id !== action.id) 
                      });
                    } else {
                      setNodeFormData({ 
                        ...nodeFormData, 
                        actions: [...actions, { id: action.id, name: action.name, targetStep: "" }] 
                      });
                    }
                  },
                  style: isSelected ? { backgroundColor: action.color } : {}
                }, action.name);
              })
            )
          ),

          // 操作配置
          nodeFormData.actions?.map((action, idx) => 
            $r('div', { key: idx, className: 'p-2 bg-gray-50 rounded border space-y-2' },
              $r(Label, { className: 'text-xs font-medium' }, `${action.name} Configuration`),
              
              // 目标步骤
              $r('div', null,
                $r(Label, { className: 'text-xs text-gray-600' }, 'Target Step'),
                $r(Select, {
                  value: action.targetStep,
                  onValueChange: (value) => {
                    const updatedActions = [...nodeFormData.actions];
                    updatedActions[idx] = { ...updatedActions[idx], targetStep: value };
                    setNodeFormData({ ...nodeFormData, actions: updatedActions });
                  }
                },
                  $r(SelectTrigger, { className: 'text-xs' },
                    $r(SelectValue, { placeholder: "Select step" })
                  ),
                  $r(SelectContent, null,
                    FLOW_NODES.map(node => 
                      $r(SelectItem, { key: node.id, value: node.id }, node.name)
                    )
                  )
                )
              ),

              // 下一个处理人
              $r('div', null,
                $r(Label, { className: 'text-xs text-gray-600' }, 'Next Handler'),
                $r(Select, {
                  value: action.nextHandler,
                  onValueChange: (value) => {
                    const updatedActions = [...nodeFormData.actions];
                    updatedActions[idx] = { ...updatedActions[idx], nextHandler: value };
                    setNodeFormData({ ...nodeFormData, actions: updatedActions });
                  }
                },
                  $r(SelectTrigger, { className: 'text-xs' },
                    $r(SelectValue, { placeholder: "Select handler" })
                  ),
                  $r(SelectContent, null,
                    $r(SelectItem, { value: "initiator" }, "Initiator"),
                    $r(SelectItem, { value: "current" }, "Current Handler"),
                    roles.map(role => 
                      $r(SelectItem, { key: role.id, value: role.name }, role.name)
                    )
                  )
                )
              )
            )
          ),

          // CC角色配置
          $r('div', null,
            $r(Label, { className: 'text-xs' }, 'CC Roles (Carbon Copy)'),
            $r(Button, {
              type: "button",
              variant: "outline",
              size: "sm",
              className: "w-full mt-1",
              onClick: () => setShowCCConfig(!showCCConfig)
            },
              `${showCCConfig ? "Hide" : "Configure"} CC (${nodeFormData.ccRoles?.length || 0})`
            ),
            showCCConfig && $r('div', { className: 'grid grid-cols-2 gap-1 mt-2 p-2 border rounded max-h-32 overflow-y-auto' },
              roles.map(role => {
                const isSelected = nodeFormData.ccRoles?.includes(role.name);
                return $r('button', {
                  key: role.id,
                  type: "button",
                  onClick: () => {
                    const ccRoles = nodeFormData.ccRoles || [];
                    setNodeFormData({
                      ...nodeFormData,
                      ccRoles: isSelected 
                        ? ccRoles.filter(r => r !== role.name)
                        : [...ccRoles, role.name]
                    });
                  },
                  className: `p-1.5 text-xs border rounded ${
                    isSelected ? 'border-blue-500 bg-blue-50' : ''
                  }`
                }, role.name);
              })
            )
          ),

          // 模块配置（简化：MODULE_LIBRARY 改为空数组，可自行补充）
          $r('div', null,
            $r(Label, { className: 'text-xs' }, 'Modules'),
            $r('div', { className: 'grid grid-cols-3 gap-1 max-h-48 overflow-y-auto mt-1 p-1 border rounded' },
              (window.MODULE_LIBRARY || []).map(module => {
                const iconName = ICON_MAP[module.icon] || ICON_MAP.Box;
                const isSelected = nodeFormData.modules?.includes(module.id);
                return $r('button', {
                  key: module.id,
                  type: "button",
                  onClick: () => {
                    const modules = nodeFormData.modules || [];
                    setNodeFormData({
                      ...nodeFormData,
                      modules: isSelected 
                        ? modules.filter(m => m !== module.id)
                        : [...modules, module.id]
                    });
                  },
                  className: `p-1.5 border rounded text-left hover:bg-gray-50 ${
                    isSelected ? 'border-blue-500 bg-blue-50' : ''
                  }`
                },
                  $r('div', { className: 'flex flex-col gap-0.5' },
                    $r(window.CommonComponents.Icon, { name: iconName, size: 12 }),
                    $r('span', { className: 'text-xs font-medium' }, module.name)
                  )
                );
              })
            )
          ),

          // 弹窗底部按钮
          $r('div', { className: 'flex justify-end gap-2 pt-2 border-t' },
            $r(Button, { 
              type: "button", 
              variant: "outline", 
              size: "sm",
              onClick: () => setIsNodeDialogOpen(false)
            }, "Cancel"),
            $r(Button, { 
              size: "sm", 
              onClick: handleNodeSubmit,
              disabled: !nodeFormData.id
            }, editingNodeIndex !== null ? "Update" : "Add")
          )
        )
      )
    )
  );
}

// 7. 挂载到全局，供index.html渲染
window.CompactFlowConfig = {
  render: function() {
    // 全局挂载MODULE_LIBRARY（如果需要）
    window.MODULE_LIBRARY = window.MODULE_LIBRARY || [];
    // 渲染组件到页面容器
    ReactDOM.render($r(CompactFlowConfigComponent), document.getElementById('app-content'));
  }
};

// 8. 可选：暴露组件供其他页面复用
window.CompactFlowConfigComponent = CompactFlowConfigComponent;
