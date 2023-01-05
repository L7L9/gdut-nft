import React, { PureComponent } from 'react'
export default class ErrorBoundary extends PureComponent {

    state = {
        error: undefined,
        errorInfo: undefined
    }

    componentDidCatch(error, errorInfo) {
    this.setState({
        error: error,
        errorInfo: errorInfo
    })
    }

    render() {

    if (this.state.errorInfo) {
      // Error path
        return (
        <div>
            <h2>哎呀，网页出错了，请联系相关人员进行修复</h2>
            <h3>解决方法：尝试关闭当前tab页面，重新打开</h3>
            <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
            </details>
    </div>
    );
    }

    return this.props.children;
    }
}