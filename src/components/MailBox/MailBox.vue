<script lang="ts" setup>
import { refDebounced } from '@vueuse/core'
import { useRouteParams } from '@vueuse/router'
import {
  Search,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { Input } from '@/components/ui/input'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import AccountSwitcher from './AccountSwitcher.vue'
import MailDisplay from './MailDisplay.vue'
import MailList from './MailList.vue'
import MailNav, { type LinkProp } from './MailNav.vue'
import type { Mail } from '@/data/mails'

interface MailProps {
  accounts: {
    email: string
    icon: string
    label: string
  }[]
  defaultCollapsed?: boolean
  defaultLayout?: number[]
  mails: Mail[]
  navCollapsedSize: number
}

const box = useRouteParams<string>('box', 'INBOX')

const props = withDefaults(defineProps<MailProps>(), {
  defaultCollapsed: false,
  defaultLayout: () => [265, 440, 655],
})

const isCollapsed = ref(props.defaultCollapsed)
const selectedMail = ref<string | undefined>(props.mails[0].id)
const searchValue = ref('')
const debouncedSearch = refDebounced(searchValue, 250)

const filteredMailList = computed(() => {
  let output: Mail[] = []
  const searchValue = debouncedSearch.value.trim()
  if (!searchValue) {
    output = props.mails
  }

  else {
    output = props.mails.filter((item) => {
      return item.name.includes(debouncedSearch.value)
        || item.email.includes(debouncedSearch.value)
        || item.name.includes(debouncedSearch.value)
        || item.subject.includes(debouncedSearch.value)
        || item.text.includes(debouncedSearch.value)
    })
  }

  return output
})

const unreadMailList = computed(() => filteredMailList.value.filter(item => !item.read))

const selectedMailData = computed(() => props.mails.find(item => item.id === selectedMail.value))

const links: LinkProp[] = [
  {
    title: 'Inbox',
    box: 'inbox',
    count: '128',
    icon: 'lucide:inbox',
  },
  {
    title: 'Drafts',
    box: 'drafts',
    count: '9',
    icon: 'lucide:file',
  },
  {
    title: 'Sent',
    box: 'sent',
    count: '',
    icon: 'lucide:send',
  },
  {
    title: 'Junk',
    box: 'junk',
    count: '23',
    icon: 'lucide:archive',
  },
  {
    title: 'Trash',
    box: 'trash',
    count: '',
    icon: 'lucide:trash',
  },
  {
    title: 'Archive',
    box: 'archive',
    count: '',
    icon: 'lucide:archive',
  },
]

const linksComputed = computed(() => links.map(link => ({ ...link, active: link.box === box.value })))

const links2: LinkProp[] = [
  {
    title: 'Social',
    box: 'social',
    count: '972',
    icon: 'lucide:user-2',
  },
  {
    title: 'Updates',
    box: 'updates',
    count: '342',
    icon: 'lucide:alert-circle',
  },
  {
    title: 'Forums',
    box: 'forums',
    count: '128',
    icon: 'lucide:message-square',
  },
  {
    title: 'Shopping',
    box: 'shopping',
    count: '8',
    icon: 'lucide:shopping-cart',
  },
  {
    title: 'Promotions',
    box: 'promotions',
    count: '21',
    icon: 'lucide:archive',
  },
]

function onCollapse() {
  isCollapsed.value = true
}

function onExpand() {
  isCollapsed.value = false
}
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <ResizablePanelGroup
      id="resize-panel-group-1"
      direction="horizontal"
      class="h-full max-h-[100%] items-stretch"
    >
      <ResizablePanel
        id="resize-panel-1"
        :default-size="defaultLayout[0]"
        :collapsed-size="navCollapsedSize"
        collapsible
        :min-size="15"
        :max-size="20"
        :class="cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')"
        @expand="onExpand"
        @collapse="onCollapse"
      >
        <div :class="cn('flex h-[56px] items-center justify-center', isCollapsed ? 'h-[56px]' : 'px-2')">
          <AccountSwitcher
            :is-collapsed="isCollapsed"
            :accounts="accounts"
          />
        </div>
        <Separator />
        <MailNav
          :is-collapsed="isCollapsed"
          :links="linksComputed"
        />
        <Separator />
        <MailNav
          :is-collapsed="isCollapsed"
          :links="links2"
        />
      </ResizablePanel>
      <ResizableHandle
        id="resize-handle-1"
        with-handle
      />
      <ResizablePanel
        id="resize-panel-2"
        :default-size="defaultLayout[1]"
        :min-size="30"
      >
        <Tabs default-value="all">
          <div class="flex items-center px-4 py-2">
            <h1 class="text-xl font-bold">
              Inbox
            </h1>
            <TabsList class="ml-auto">
              <TabsTrigger
                value="all"
                class="text-zinc-600 dark:text-zinc-200"
              >
                All mail
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                class="text-zinc-600 dark:text-zinc-200"
              >
                Unread
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />
          <div class="bg-background/95 p-4 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
            <form>
              <div class="relative">
                <Search class="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                <Input
                  v-model="searchValue"
                  placeholder="Search"
                  class="pl-8"
                />
              </div>
            </form>
          </div>
          <TabsContent
            value="all"
            class="m-0"
          >
            <MailList
              v-model:selected-mail="selectedMail"
              :items="filteredMailList"
            />
          </TabsContent>
          <TabsContent
            value="unread"
            class="m-0"
          >
            <MailList
              v-model:selected-mail="selectedMail"
              :items="unreadMailList"
            />
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle
        id="resiz-handle-2"
        with-handle
      />
      <ResizablePanel
        id="resize-panel-3"
        :default-size="defaultLayout[2]"
      >
        <MailDisplay :mail="selectedMailData" />
      </ResizablePanel>
    </ResizablePanelGroup>
  </TooltipProvider>
</template>
