Vue.component("modal", {
  template: "#modal-template"
});

Vue.component("blog-articles", {
  template: "#my-template",
  props: ["datesArticles"],
  data() {
    return {
      searchQuery: ""
    };
  },
  computed: {
    searchedArticles() {
      var searchRegex = new RegExp(this.searchQuery, "i");
      var searchedObj = {};

      if (this.searchQuery == "") {
        return this.datesArticles;
      }

      for (var date in this.datesArticles) {
        searchedObj[date] = this.datesArticles[date].filter(article => {
          return (
            searchRegex.test(article.tag) ||
            searchRegex.test(article.text) ||
            searchRegex.test(article.time)
          );
        });
      }
      return searchedObj;
    }
  },
  mounted() {},

  methods: {
    anyArticle() {
      return this.countAllArticles() ? true : false;
    },
    countAllArticles() {
      var count = 0;
      for (var date in this.searchedArticles) {
        count += this.searchedArticles[date].length;
      }
      return count;
    }
  }
});

new Vue({
  el: "#app",
  data: {
    display: "profile",
    showModal: false,
    isEditing: true,
    selectedActivity: "",
    selectedTag: "",
    selectedLevel: "",
    selectedYear: "",
    selectedMonth: "",
    selectedDay: "",
    selectedFrom: "",
    selectedTo: "",
    from: "",
    to: "",
    years: ["2017", "2018"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    days: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31"
    ],
    time: [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23"
    ],

    tags: [],
    level: ["1", "2", "3", "4", "5"],

    chartData: [["Jan", 4], ["Feb", 2], ["Mar", 10], ["Apr", 5], ["May", 3]],

    datesArticles: {
      "8am": [
        {
          tag: "Learning",
          text: "Learned advanced AI",
          hour: "8 am"
        },
        {
          tag: "Sleep",
          text: "",
          hour: "9 am"
        }
      ],
      "April, 2016": [
        {
          tag: "Misc",
          text: "Went to gym",
          hour: "10 am"
        },
        {
          tag: "Homework",
          text: "Did CSE 72sfdf30 assignment",
          hour: "11 am"
        }
      ],
      "December, 2015": [
        {
          tag: "Cooewfking",
          text: "Made lunch",
          hour: "12 pm"
        },
        {
          tag: "Sleep",
          text: "",
          hour: "1 pm"
        },
        {
          tag: "Sleep",
          text: "sdfsdf",
          hour: "2 pm"
        }
      ]
    }
  },
  mounted() {
    this.getTag();
  },
  methods: {
    activityAdd() {
      this.display = "profile";
      this.convertToUTC();
      this.addNewEntry();
    },

    convertToUTC() {
      val = new Date();
      this.selectedTo = val.setHours(this.to, 0, 0) / 1000;
      this.selectedFrom = val.setHours(this.from, 0, 0) / 1000;
      console.log(this.selectedFrom);
      console.log(this.selectedTo);
    },

    /////////////////   roshan editted
    getTag: function() {
      fetch(`/api/tag`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.success) this.tags = data.tags;
        })
        .catch(err => console.error(err));
    },

    addNewEntry: function() {
      fetch("/api/entry", {
        method: "post",
        body: JSON.stringify({
          to: this.selectedTo,
          from: this.selectedFrom,
          text: this.selectedActivity,
          tag_id: this.selectedTag.id,
          p_level: this.selectedLevel
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          (this.to = ""),
            (this.from = ""),
            (this.selectedActivity = ""),
            (this.selectedTag = ""),
            (this.selectedLevel = "");
        })
        .catch(err => console.error(err));
    }
  }
});
