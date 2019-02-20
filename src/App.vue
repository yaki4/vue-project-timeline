<template>
  <div id="vue-project-timeline">
    <div v-if="projects">
      <div class="ptl1-flex" v-if="invalidProjects.length === 0">
        <div class="ptl1-hidden sm:ptl1-flex sm:ptl1-w-1/2 md:ptl1-w-1/4 ptl1-justify-end sm:ptl1-pr-4 vt-timeline" :style="{ backgroundColor: timelineBgColor }" @click="clickOn()" @mouseleave="hoverOff()">
          <div class="ptl1-flex ptl1-flex-col ptl1-border-r-2 ptl1-py-4 vt-years-wrapper" :style="{ borderColor: timelineColor }">
            <div class="ptl1-flex ptl1-text-white ptl1-pr-2 ptl1-h-10 ptl1-items-center" :key="'y' + key" v-for="(year, key) in timelineYears">
              <h3 class="ptl1-font-normal vt-year-title">{{ year }}</h3>
            </div>
          </div>
          <div class="ptl1-flex ptl1-flex-col ptl1-py-4 vt-timelines-wrapper" :key="'t' + key" v-for="(timeline, key) in timelines">
            <div class="ptl1-ml-4" :key="'p' + key" v-for="(projectId, key) in timeline">
              <div class="ptl1-h-10 vt-timeline-spacer" :key="'n' + key" v-for="(n, key) in getProjectSpacing(timeline, key)"></div>
              <div
                class="ptl1-h-10 ptl1-w-3 ptl1-cursor-pointer ptl1-bg-white ptl1-opacity-50 vt-timeline-line"
                :style="getTimelineElementStyle(projectId)"
                :class="{ 'ptl1-shadow-md ptl1-opacity-100 vt-selected-line' : selectedProject === projectId }"
                :key="'py' + key"
                v-for="(n, key) in getProjectYears(projectId)"
                @click.stop="selectedProject = projectId">
              </div>
            </div>
          </div>
        </div>
        <div class="ptl1-flex ptl1-flex-col ptl1-w-full sm:ptl1-w-1/2 md:ptl1-w-3/4">
          <project-card
            :project="project"
            :selected="selectedProject === key"
            :selectedBgColor="selectedBgColor"
            :hoverBgColor="hoverBgColor"
            :key="'pc' + key"
            v-for="(project, key) in sortedProjects"
            @selected="selectedProject = key">
          </project-card>
        </div>
      </div>
      <config-error :invalidProjects="invalidProjects" v-else></config-error>
    </div>
    <div v-else>
      <p>No projects provided. Please see <a href="https://github.com/gerwinov/vue-project-timeline">the docs</a> for required config.</p>
    </div>
  </div>
</template>

<script>
  import ProjectCard from './components/ProjectCard.vue'
  import ConfigError from './components/ConfigError.vue'

  export default {
    name: 'VueProjectTimeline',
    components: {
      ProjectCard, ConfigError
    },

    props: {
      timelineColor: {
        required: false,
        default: '#ffcb3b',
        type: String
      },

      timelineBgColor: {
        required: false,
        default: '#fc5f54',
        type: String
      },

      selectedBgColor: {
        required: false,
        default: '#fc5f54',
        type: String
      },

      hoverBgColor: {
        required: false,
        default: '#feebd8',
        type: String
      },

      projects: {
        required: true,
        type: Array
      },
      
      order: {
        required: false,
        default: 'asc',
        type: String
      }
    },

    data () {
      return {
        selectedProject: 0,
        scrollLocked: false
        // projects: [
        //   {
        //     title: 'Client one',
        //     subtitle: 'Developer',
        //     description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        //                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        //                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        //                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        //                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        //                  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        //     image: `logo.png`,
        //     startYear: 2014,
        //     endYear: 2017,
        //     color: '#4a63e0'
        //   },
        //   {
        //     title: 'Client two',
        //     subtitle: 'Developer',
        //     description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        //                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        //                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        //                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        //                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        //                  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        //     image: `logo.png`,
        //     startYear: 2014,
        //     endYear: 2015,
        //     color: '#4a63e0'
        //   },
        //   {
        //     title: 'Client three',
        //     subtitle: 'Developer',
        //     description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        //                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        //                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        //                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        //                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        //                  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        //     image: `logo.png`,
        //     startYear: 2016,
        //     endYear: 2016,
        //     color: '#4a63e0'
        //   }
        // ]
      }
    },

    computed: {
      sortedProjects () {
        let projects = this.projects.map((project) => {
          if (!project.endYear) {
            // Use Object.assign to avoid mutating an object which belongs to the project array, which is a prop.
            return Object.assign({}, project, {
              endYear: this.currentYear
            })
          }
          return project
        })
        let temp = projects.sort((a, b) => {
          if (a.endYear > b.endYear) {
            return -1;
          }
          if (a.endYear < b.endYear) {
            return 1;
          }
          return 0;
        })
        if (this.order === 'asc') {
          return temp
        } else {
          let fin = []
          for (let i = temp.length - 1; i >= 0; i--) {
            fin.push(temp[i])
          }
          return fin
        }
      },

      invalidProjects () {
        let invalids = []

        this.projects.forEach((project) => {
          if (project.title) {
            if (project.startYear && project.startYear > 1900 && project.startYear < 2100) {
              if (project.endYear <= this.currentYear) {
                if (!project.endYear || project.endYear >= project.startYear)
                return
              }
            }
          }

          invalids.push(project)
        })

        return invalids
      },

      endYear () {
        return Math.max.apply(Math, this.sortedProjects.map((project) => {
          return project.endYear
        }))
      },

      startYear () {
        return Math.min.apply(Math, this.sortedProjects.map((project) => {
          return project.startYear
        }))
      },

      currentYear () {
        return (new Date()).getFullYear()
      },

      timelines () {
        let timelines = []

        this.sortedProjects.forEach((project, index) => {
          if (this.order === 'asc') {
            this.addToTimeline(project.endYear, index, timelines)
          } else {
            this.addToTimeline(project.startYear, index, timelines)
          }
        })
        return timelines
      },

      timelineYears () {
        let timelineYears = []

        if (this.order === 'asc') {
          for (let i = this.endYear; i >= this.startYear; i--) {
            timelineYears.push(i)
            if (i !== this.startYear) timelineYears.push(null)
          }
        } else {
          for (let i = this.startYear; i <= this.endYear; i++) {
            timelineYears.push(i)
            if (i !== this.endYear) timelineYears.push(null)
          }
        }

        return timelineYears
      }
    },

    methods: {
      addToTimeline (projectEndYear, projectIndex, timelines, timelineIndex = 0) {
        if (!Array.isArray(timelines[timelineIndex])) {
          timelines[timelineIndex] = [projectIndex]
          return timelines
        }
        if (this.order === 'asc') {
          if (projectEndYear < this.sortedProjects[timelines[timelineIndex][timelines[timelineIndex].length -1]].startYear) {
            timelines[timelineIndex].push(projectIndex)
            return timelines
          }
        } else {
          if (projectEndYear > this.sortedProjects[timelines[timelineIndex][timelines[timelineIndex].length -1]].endYear) {
            timelines[timelineIndex].push(projectIndex)
            return timelines
          }
        }

        this.addToTimeline(projectEndYear, projectIndex, timelines, timelineIndex + 1)
      },

      getProjectYears (id) {
        return ((this.sortedProjects[id].endYear - this.sortedProjects[id].startYear) * 2) + 1
      },

      getProjectSpacing (timeline, key) {
        if (this.order === 'asc') {
          if (key === 0) {
            return (this.endYear - this.sortedProjects[timeline[key]].endYear) * 2
          } else {
            return (this.sortedProjects[timeline[key - 1]].startYear - this.sortedProjects[timeline[key]].endYear) * 2 - 1
          }
        } else {
          if (key === 0) {
            return (this.sortedProjects[timeline[key]].startYear - this.startYear) * 2
          } else {
            return (this.sortedProjects[timeline[key]].startYear - this.sortedProjects[timeline[key - 1]].endYear) + 1
          }
        }

      },

      getTimelineElementStyle (projectId) {
        if (this.selectedProject === projectId) {
          return 'backgroundColor: ' + this.sortedProjects[projectId].color
        }
      },

      clickOn () {
        this.scrollLocked = !this.scrollLocked

        if (this.scrollLocked) {
          window.addEventListener('wheel', this.handleScroll)
          return
        }
        window.removeEventListener('wheel', this.handleScroll)
      },

      hoverOff () {
        this.scrollLocked = false
        window.removeEventListener('wheel', this.handleScroll)
      },

      handleScroll (e) {
        if (e.deltaY > 0) this.nextProject()
        if (e.deltaY < 0) this.prevProject()

        e.preventDefault()
      },

      nextProject () {
        if (this.selectedProject < this.sortedProjects.length - 1) {
          this.selectedProject++
          return
        }

        this.selectedProject = 0
      },

      prevProject () {
        if (this.selectedProject > 0) {
          this.selectedProject--
          return
        }

        this.selectedProject = this.sortedProjects.length - 1
      }
    },
  }
</script>

<style src="./styles/main.css"></style>
