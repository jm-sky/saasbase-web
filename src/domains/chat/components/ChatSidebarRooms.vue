<script setup lang="ts">
import type { IChatRoom } from '../types/chat.type'

defineProps<{
  rooms: IChatRoom[]
  roomId: string
  joinRoom: (roomId: string) => void
}>()

const emit = defineEmits<{
  join: []
}>()

const showParticipants = (selectedRoom: IChatRoom) => selectedRoom.participants.map(p => p.name).join(', ')
</script>

<template>
  <div class="font-bold mb-1">
    Rooms
  </div>

  <div v-if="rooms.length === 0" class="text-gray-500 text-sm py-1">
    No rooms
  </div>

  <ul class="flex flex-col gap-1">
    <li
      v-for="room in rooms"
      :key="room.id"
      class="px-3 py-2 rounded bg-gray-100 text-sm hover:bg-sky-200 cursor-pointer flex items-center gap-1"
      :class="{ 'bg-sky-200': room.id === roomId }"
      :title="room.id"
      @click="[joinRoom(room.id), emit('join')]"
    >
      <div>
        {{ showParticipants(room) }}
      </div>
      <i v-if="room.id === roomId" class="fa-solid fa-check ml-1" />
    </li>
  </ul>
</template>
