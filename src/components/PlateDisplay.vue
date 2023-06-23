<template>
  <div>
    <slot name="title"></slot>
    <v-row>
      <v-col cols="12" sm="6" lg="3">
        <v-card id="total"  @click="$emit('changeType', null)"
          >
          <v-card-text class="mb-1">
            <div class="display-2 mt-n2 blue--text font-weight-bold">
              {{ totalPlates }}
            </div>
            <span class="subheading">{{ $t("total_plate_number") }}</span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card id="known" @click="$emit('changeType', 'known')"
          >
          <v-card-text class="mb-1">
            <div class="display-2 mt-n2 green--text font-weight-bold">
              {{ knownPlates }}
            </div>
            <span class="subheading">{{ $t("known_plate") }}</span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card id="unknown" @click="$emit('changeType', 'unknown')"
          >
          <v-card-text class="mb-1">
            <div class="display-2 mt-n2 orange--text font-weight-bold">
              {{ unknownPlates }}
            </div>
            <span class="subheading">{{ $t("unknown_plate") }}</span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card id="bad" @click="$emit('changeType', 'bad')"
          >
          <v-card-text class="mb-1">
            <div class="display-2 mt-n2 red--text font-weight-bold">
              {{ badPlates }}
            </div>
            <span class="subheading">{{ $t("bad_plate") }}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    totalPlates: Number,
    knownPlates: Number,
    unknownPlates: Number,
    badPlates: Number
  }
}
</script>