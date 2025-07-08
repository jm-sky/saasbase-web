import { nextTick, ref, watch, watchEffect } from 'vue'

interface UseAutoScrollOptions {
  offset?: number
  smooth?: boolean
  content?: unknown
}

export default function useAutoScroll(options: UseAutoScrollOptions = {}) {
  const { offset = 20, smooth = false, content } = options
  const scrollRef = ref<HTMLElement | null>(null)
  const lastContentHeight = ref(0)
  const userHasScrolled = ref(false)

  const isAtBottom = ref(true)
  const autoScrollEnabled = ref(true)

  function checkIsAtBottom(element: HTMLElement) {
    const { scrollTop, scrollHeight, clientHeight } = element
    const distanceToBottom = Math.abs(scrollHeight - scrollTop - clientHeight)
    return distanceToBottom <= offset
  }

  function scrollToBottom(instant = false) {
    if (!scrollRef.value) return
    const targetScrollTop = scrollRef.value.scrollHeight - scrollRef.value.clientHeight
    if (instant) {
      scrollRef.value.scrollTop = targetScrollTop
    } else {
      scrollRef.value.scrollTo({
        top: targetScrollTop,
        behavior: smooth ? 'smooth' : 'auto',
      })
    }
    isAtBottom.value = true
    autoScrollEnabled.value = true
    userHasScrolled.value = false
  }

  function handleScroll() {
    if (!scrollRef.value) return
    const atBottom = checkIsAtBottom(scrollRef.value)
    isAtBottom.value = atBottom
    if (atBottom) {
      autoScrollEnabled.value = true
    }
  }

  // Watch for scroll element to become available and attach listeners
  watchEffect((onInvalidate) => {
    if (!scrollRef.value) return

    const element = scrollRef.value
    element.addEventListener('scroll', handleScroll, { passive: true })

    onInvalidate(() => {
      element.removeEventListener('scroll', handleScroll)
    })
  })

  // Create a MutationObserver to watch for content changes
  watchEffect((onInvalidate) => {
    if (!scrollRef.value) return

    const observer = new MutationObserver(() => {
      const scrollElement = scrollRef.value
      if (!scrollElement) return

      const currentHeight = scrollElement.scrollHeight
      const hasNewContent = currentHeight !== lastContentHeight.value

              if (hasNewContent) {
          if (autoScrollEnabled.value) {
            void nextTick(() => {
              scrollToBottom(lastContentHeight.value === 0)
            })
          }
          lastContentHeight.value = currentHeight
        }
    })

    observer.observe(scrollRef.value, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    onInvalidate(() => {
      observer.disconnect()
    })
  })

  // Also watch for explicit content changes if provided
  if (content !== undefined) {
    watch(
      () => content,
      () => {
        const scrollElement = scrollRef.value
        if (!scrollElement) return
        const currentHeight = scrollElement.scrollHeight
        const hasNewContent = currentHeight !== lastContentHeight.value
                 if (hasNewContent) {
           if (autoScrollEnabled.value) {
             void nextTick(() => {
               scrollToBottom(lastContentHeight.value === 0)
             })
           }
           lastContentHeight.value = currentHeight
         }
      },
      { immediate: true }
    )
  }

  function disableAutoScroll() {
    const atBottom = scrollRef.value ? checkIsAtBottom(scrollRef.value) : false
    if (!atBottom) {
      userHasScrolled.value = true
      autoScrollEnabled.value = false
    }
  }

  return {
    scrollRef,
    isAtBottom,
    autoScrollEnabled,
    scrollToBottom: () => { scrollToBottom(false) },
    disableAutoScroll,
  }
}
