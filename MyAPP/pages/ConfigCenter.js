// ConfigCenter.js - React版本（适配浏览器环境）
// 1. 定义Tabs相关组件（替代@/components/ui/tabs）
const Tabs = ({ defaultValue, children, className }) => {
    const [active, setActive] = React.useState(defaultValue);
    return React.createElement('div', { className }, 
        React.Children.map(children, child => {
            if (child.props?.['data-component'] === 'TabsList') {
                return React.cloneElement(child, { active, setActive });
            }
            if (child.props?.['data-component'] === 'TabsContent') {
                return child.props.value === active ? child : null;
            }
            return child;
        })
    );
};

const TabsList = ({ children, active, setActive, className }) => {
    return React.createElement('div', { 
        className: `tabs-list ${className}`,
        'data-component': 'TabsList'
    },
        React.Children.map(children, child => 
            React.cloneElement(child, { active, setActive })
        )
    );
};

const TabsTrigger = ({ value, children, active, setActive, className }) => {
    return React.createElement('button', {
        className: `tabs-trigger ${className} ${active === value ? 'bg-blue-500 text-white' : ''}`,
        onClick: () => setActive(value),
        'data-state': active === value ? 'active' : 'inactive',
        'data-component': 'TabsTrigger'
    }, children);
};

const TabsContent = ({ value, children, className }) => {
    return React.createElement('div', { 
        className: `tabs-content ${className}`,
        'data-component': 'TabsContent',
        'data-value': value
    }, children);
};

// 2. 定义子组件（占位，后续可替换为实际逻辑）
const RegionManager = () => {
    return React.createElement('div', { className: 'p-4' },
        React.createElement('h3', { className: 'font-medium mb-2' }, 'Region Manager'),
        React.createElement('p', { className: 'text-sm text-gray-600' }, 
            'Total regions loaded: ', JSON.stringify(window.Region?.properties?.region?.enum || 0)
        )
    );
};

const OrganizationManager = () => {
    return React.createElement('div', { className: 'p-4' },
        React.createElement('h3', { className: 'font-medium mb-2' }, 'Organization Manager'),
        React.createElement('p', { className: 'text-sm text-gray-600' }, 'Organization data loaded successfully')
    );
};

const RoleManager = () => {
    return React.createElement('div', { className: 'p-4' },
        React.createElement('h3', { className: 'font-medium mb-2' }, 'Role Manager'),
        React.createElement('p', { className: 'text-sm text-gray-600' }, 'Role permission data loaded')
    );
};

const ProgramManager = () => {
    return React.createElement('div', { className: 'p-4' },
        React.createElement('h3', { className: 'font-medium mb-2' }, 'Program Manager'),
        React.createElement('p', { className: 'text-sm text-gray-600' }, 'Program schedule data loaded')
    );
};

const RolePermissionManager = () => {
    return React.createElement('div', { className: 'p-4' },
        React.createElement('h3', { className: 'font-medium mb-2' }, 'Role Permission Manager'),
        React.createElement('p', { className: 'text-sm text-gray-600' }, 'Permission rules loaded')
    );
};

const CompactTaskConfig = () => {
    return React.createElement('div', { className: 'p-4' },
        React.createElement('h3', { className: 'font-medium mb-2' }, 'Compact Task Config'),
        React.createElement('p', { className: 'text-sm text-gray-600' }, 'Task configuration loaded')
    );
};

const CompactFlowConfig = () => {
    return React.createElement('div', { className: 'p-4' },
        React.createElement('h3', { className: 'font-medium mb-2' }, 'Compact Flow Config'),
        React.createElement('p', { className: 'text-sm text-gray-600' }, 'Flow rules loaded successfully')
    );
};

// 3. 核心ConfigCenter组件
const ConfigCenterComponent = () => {
    // 简化Lucide图标
    const Building2 = () => React.createElement('i', { className: 'lucide lucide-building-2', style: { width: '16px', height: '16px' } });
    const Users = () => React.createElement('i', { className: 'lucide lucide-users', style: { width: '16px', height: '16px' } });
    const Shield = () => React.createElement('i', { className: 'lucide lucide-shield', style: { width: '16px', height: '16px' } });
    const Calendar = () => React.createElement('i', { className: 'lucide lucide-calendar', style: { width: '16px', height: '16px' } });
    const Key = () => React.createElement('i', { className: 'lucide lucide-key', style: { width: '16px', height: '16px' } });
    const Settings = () => React.createElement('i', { className: 'lucide lucide-settings', style: { width: '16px', height: '16px' } });
    const GitBranch = () => React.createElement('i', { className: 'lucide lucide-git-branch', style: { width: '16px', height: '16px' } });

    return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-6' },
        React.createElement('div', { className: 'max-w-7xl mx-auto' },
            // 页面标题
            React.createElement('div', { className: 'mb-6' },
                React.createElement('h1', { className: 'text-2xl md:text-3xl font-bold text-gray-900 mb-2' }, 'Configuration Center'),
                React.createElement('p', { className: 'text-sm text-gray-600' }, 'System configuration and permission management')
            ),

            // Tabs组件
            React.createElement(Tabs, { defaultValue: 'region', className: 'w-full' },
                // Tabs标签栏
                React.createElement(TabsList, { className: 'grid w-full grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 mb-4 h-auto gap-1' },
                    React.createElement(TabsTrigger, { value: 'region', className: 'flex items-center gap-1 py-2 px-2 text-xs' },
                        React.createElement(Building2),
                        React.createElement('span', { className: 'hidden sm:inline' }, 'Region')
                    ),
                    React.createElement(TabsTrigger, { value: 'organization', className: 'flex items-center gap-1 py-2 px-2 text-xs' },
                        React.createElement(Users),
                        React.createElement('span', { className: 'hidden sm:inline' }, 'Org')
                    ),
                    React.createElement(TabsTrigger, { value: 'role', className: 'flex items-center gap-1 py-2 px-2 text-xs' },
                        React.createElement(Shield),
                        React.createElement('span', { className: 'hidden sm:inline' }, 'Role')
                    ),
                    React.createElement(TabsTrigger, { value: 'program', className: 'flex items-center gap-1 py-2 px-2 text-xs' },
                        React.createElement(Calendar),
                        React.createElement('span', { className: 'hidden sm:inline' }, 'Program')
                    ),
                    React.createElement(TabsTrigger, { value: 'permission', className: 'flex items-center gap-1 py-2 px-2 text-xs' },
                        React.createElement(Key),
                        React.createElement('span', { className: 'hidden sm:inline' }, 'Permission')
                    ),
                    React.createElement(TabsTrigger, { value: 'tasks', className: 'flex items-center gap-1 py-2 px-2 text-xs' },
                        React.createElement(Settings),
                        React.createElement('span', { className: 'hidden sm:inline' }, 'Tasks')
                    ),
                    React.createElement(TabsTrigger, { value: 'flows', className: 'flex items-center gap-1 py-2 px-2 text-xs' },
                        React.createElement(GitBranch),
                        React.createElement('span', { className: 'hidden sm:inline' }, 'Flows')
                    )
                ),

                // Tabs内容区
                React.createElement(TabsContent, { value: 'region' }, React.createElement(RegionManager)),
                React.createElement(TabsContent, { value: 'organization' }, React.createElement(OrganizationManager)),
                React.createElement(TabsContent, { value: 'role' }, React.createElement(RoleManager)),
                React.createElement(TabsContent, { value: 'program' }, React.createElement(ProgramManager)),
                React.createElement(TabsContent, { value: 'permission' }, React.createElement(RolePermissionManager)),
                React.createElement(TabsContent, { value: 'tasks' }, React.createElement(CompactTaskConfig)),
                React.createElement(TabsContent, { value: 'flows' }, React.createElement(CompactFlowConfig))
            )
        )
    );
};

// 4. 挂载到全局，供index.html调用渲染
window.ConfigCenter = {
    render: function() {
        const appContent = document.getElementById('app-content');
        // 渲染React组件到页面容器
        ReactDOM.render(React.createElement(ConfigCenterComponent), appContent);
    }
};
