// json数据格式化
export const useJSONFormat = () => {
    // 获取指定类名的第一个子节点
    const getChildByClassName = (el, className) => {
        let children = el.children
        for (let i = 0; i < children.length; i++) {
            if (children[i].classList.contains(className)) {
                return children[i]
            }
        }
        return null
    }

    // json数据展开收缩
    let expandIndex = 0
    const jsonClick = e => {
        // 点击是展开收缩按钮
        if (e.target && e.target.classList.contains('expandBtn')) {
            let target = e.target
            let parent = target.parentNode
            // id，每个展开收缩按钮唯一的标志
            let index = target.getAttribute('data-index')
            if (index === null) {
                index = expandIndex++
                target.setAttribute('data-index', index)
            }
            // 获取当前状态，0表示收缩、1表示展开
            let status = target.getAttribute('expand-status') || '1'
            // 在子节点里找到wrap元素
            let wrapEl = getChildByClassName(parent, 'wrap')
            // 找到下层所有的按钮节点
            let btnEls = wrapEl.querySelectorAll('.expandBtn')
            // 收缩状态 -> 展开状态
            if (status === '0') {
                // 设置状态为展开
                target.setAttribute('expand-status', '1')
                // 展开
                wrapEl.style.height = 'auto'
                // 按钮箭头旋转
                target.classList.remove('shrink')
                // 移除省略号元素
                let ellipsisEl = getChildByClassName(parent, 'ellipsis')
                parent.removeChild(ellipsisEl)
                // 显示下级展开收缩按钮
                for (let i = 0; i < btnEls.length; i++) {
                    let _index = btnEls[i].getAttribute('data-for-index')
                    // 只有被当前按钮收缩的按钮才显示
                    if (_index === index) {
                        btnEls[i].removeAttribute('data-for-index')
                        btnEls[i].style.display = 'inline-block'
                    }
                }
            } else if (status === '1') {
                // 展开状态 -> 收缩状态
                target.setAttribute('expand-status', '0')
                wrapEl.style.height = 0
                target.classList.add('shrink')
                let ellipsisEl = document.createElement('div')
                ellipsisEl.textContent = '...'
                ellipsisEl.className = 'ellipsis'
                parent.insertBefore(ellipsisEl, wrapEl)
                for (let i = 0; i < btnEls.length; i++) {
                    let _index = btnEls[i].getAttribute('data-for-index')
                    // 只隐藏当前可以被隐藏的按钮
                    if (_index === null) {
                        btnEls[i].setAttribute('data-for-index', index)
                        btnEls[i].style.display = 'none'
                    }
                }
            }
        }
    }

    return {
        jsonClick
    }
}