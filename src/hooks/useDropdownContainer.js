import {onBeforeUnmount, ref} from "vue";

export const useDropdownContainer = (dropdownContainer) => {
    const showDropdownList = ref(false)
    const toggleDropdownList = value => {
        showDropdownList.value =
            value !== undefined ? value : !showDropdownList.value
    }
    const onBodyClick = e => {
        let tar = e.target
        while (tar && tar !== document.body) {
            if (tar === dropdownContainer.value) {
                return
            }
            tar = tar.parentNode
        }
        showDropdownList.value = false
    }
    document.body.addEventListener('click', onBodyClick)
    onBeforeUnmount(() => {
        document.body.removeEventListener('click', onBodyClick)
    })

    return {
        showDropdownList,
        toggleDropdownList
    }
}