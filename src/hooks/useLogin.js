// 登录退出
import {ElMessage} from "element-plus";
import {computed, ref} from "vue";

export const useLogin = ({store, router, route}) => {
    const githubTokenInputDialogVisible = ref(false)
    const githubTokenValue = ref('')
    // github token
    const githubToken = computed(() => {
        return store.state.githubToken
    })
    // 登录
    const login = () => {
        githubTokenInputDialogVisible.value = true
    }
    // 退出登录
    const logout = () => {
        store.dispatch('saveGithubToken', null)
        router.replace({
            name: 'Editor'
        })
    }
    // 确认输入
    const confirmGithubTokenValueInput = () => {
        let trimValue = githubTokenValue.value
        if (!trimValue) {
            ElMessage.warning('请输入token')
            return
        }
        store.dispatch('saveGithubToken', trimValue)
        githubTokenInputDialogVisible.value = false
        githubTokenValue.value = ''
        if (route.name === 'Editor' && !!route.query.data) {
            router.replace({
                name: 'Editor'
            })
        }
    }
    // 取消输入
    const cancelGithubTokenValueInput = () => {
        githubTokenInputDialogVisible.value = false
        githubTokenValue.value = ''
    }
    return {
        githubTokenInputDialogVisible,
        githubTokenValue,
        githubToken,
        confirmGithubTokenValueInput,
        cancelGithubTokenValueInput,
        login,
        logout
    }
}