<script lang="ts" setup>
import { ErrorMessage } from 'vee-validate';
import { toValue } from 'vue';
import { useFormField } from './useFormField';

const { name, formMessageId } = useFormField();
</script>

<template>
  <Transition
    enter-from-class="opacity-0 -translate-y-5"
    enter-active-class="transition"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-active-class="transition"
    leave-to-class="opacity-0 -translate-y-5"
  >
    <ErrorMessage
      :id="formMessageId"
      as="p"
      :name="toValue(name)"
      class="px-1 text-xs text-destructive"
    />
  </Transition>
</template>
