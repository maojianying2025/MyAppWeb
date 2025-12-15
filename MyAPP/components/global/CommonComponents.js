// 全局通用组件库（所有Page/Component都可复用）
window.CommonComponents = (() => {
    // 1. Tabs系列组件
    const Tabs = ({ defaultValue, children, className }) => {
        const [active, setActive] = React.useState(defaultValue);
        return React.createElement('div', { className: `w-full ${className || ''}` }, 
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
            className: `flex gap-1 mb-4 flex-wrap ${className || ''}`,
            'data-component': 'TabsList'
        },
            React.Children.map(children, child => 
                React.cloneElement(child, { active, setActive })
            )
        );
    };

    const TabsTrigger = ({ value, children, active, setActive, className }) => {
        return React.createElement('button', {
            className: `px-3 py-2 text-xs border rounded flex items-center gap-1 
                       ${active === value ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-200'} 
                       ${className || ''}`,
            onClick: () => setActive(value),
            'data-state': active === value ? 'active' : 'inactive',
            'data-component': 'TabsTrigger'
        }, children);
    };

    const TabsContent = ({ value, children, className }) => {
        return React.createElement('div', { 
            className: `p-4 border rounded bg-white ${className || ''}`,
            'data-component': 'TabsContent',
            'data-value': value
        }, children);
    };

    // 2. 基础UI组件
    const Button = ({ children, onClick, className, variant = 'default' }) => {
        const baseClass = 'px-4 py-2 rounded text-sm flex items-center gap-1';
        const variants = {
            default: 'bg-blue-500 text-white hover:bg-blue-600',
            secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
            danger: 'bg-red-500 text-white hover:bg-red-600'
        };
        return React.createElement('button', {
            className: `${baseClass} ${variants[variant]} ${className || ''}`,
            onClick
        }, children);
    };

    const Input = ({ placeholder, value, onChange, className }) => {
        return React.createElement('input', {
            className: `px-3 py-2 border rounded text-sm w-full ${className || ''}`,
            placeholder,
            value,
            onChange: (e) => onChange && onChange(e.target.value)
        });
    };

    const Card = ({ title, children, className }) => {
        return React.createElement('div', { className: `border rounded bg-white ${className || ''}` },
            title ? React.createElement('div', { className: 'px-4 py-3 border-b font-medium' }, title) : null,
            React.createElement('div', { className: 'p-4' }, children)
        );
    };

    // 3. 图标组件（封装Lucide）
    const Icon = ({ name, size = 16, className }) => {
        return React.createElement('i', {
            className: `lucide lucide-${name} ${className || ''}`,
            style: { width: `${size}px`, height: `${size}px` }
        });
    };

    // 暴露所有组件
    return {
        Tabs, TabsList, TabsTrigger, TabsContent,
        Button, Input, Card, Icon
    };
})();

// 全局挂载React快捷创建元素（简化代码）
window.$r = React.createElement;
