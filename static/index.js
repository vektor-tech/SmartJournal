Vue.component('modal', {
    template: '#modal-template'
});

Vue.component('blog-articles', {
    template: '#my-template',
    props: ['datesArticles'],
    data() {
        return {
            searchQuery: ''
        }
    },
    computed: {
        searchedArticles() {
            var searchRegex = new RegExp(this.searchQuery, 'i');
            var searchedObj = {};

            if (this.searchQuery == '') {
                return this.datesArticles;
            }

            for (var date in this.datesArticles) {
                searchedObj[date] = this.datesArticles[date].filter((article) => {
                    return searchRegex.test(article.tag) ||
                        searchRegex.test(article.text) ||
                        searchRegex.test(article.time);
                });
            }
            return searchedObj;
        }
    },
    mounted() {
        let cumulativePercent = 0;
        this.value.forEach(slice => {
            // destructuring assignment sets the two variables at once
            const [startX, startY] = this.getCoordinatesForPercent(cumulativePercent);

            // each slice starts where the last slice ended, so keep a cumulative percent
            cumulativePercent += slice.percent;

            const [endX, endY] = this.getCoordinatesForPercent(cumulativePercent);

            // if the slice is more than 50%, take the large arc (the long way around)
            const largeArcFlag = slice.percent > .5 ? 1 : 0;

            // create an array and join it just for code readability
            const pathData = [
                `M ${startX} ${startY}`, // Move
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                `L 0 0`, // Line
            ].join(' ');

            // create a <path> and append it to the <svg> element
            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathEl.setAttribute('d', pathData);
            pathEl.setAttributeNS(null, 'mask', 'url(#vue-chart-pie-mask)');
            this.$el.appendChild(pathEl);
        });

    },

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
    el: '#app',
    data: {
        display: "profile",
        showModal: false,
        isEditing: true,
        selectedActivity: "",
        selectedTag: "",
        selectedYear: "",
        selectedMonth: "",
        selectedDay: "",
        years: [
            '2017', '2018'
        ],
        months: [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ],
        days: [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '23', '24', '25', '26', '27', '28', '29', '30', '31'
        ],
        tags: [
            'Sleep', 'Learn', 'Misc', 'Cooking'
        ],

        chartData: [
            ["Jan", 4],
            ["Feb", 2],
            ["Mar", 10],
            ["Apr", 5],
            ["May", 3]
        ],

        datesArticles: {
            '8am': [{
                    tag: 'Learning',
                    text: 'Learned advanced AI',
                    hour: '8 am'
                },
                {
                    tag: 'Sleep',
                    text: '',
                    hour: '9 am'
                }
            ],
            'April, 2016': [{
                    tag: 'Misc',
                    text: 'Went to gym',
                    hour: '10 am'
                },
                {
                    tag: 'Homework',
                    text: 'Did CSE 7230 assignment',
                    hour: '11 am'
                }
            ],
            'December, 2015': [{
                    tag: 'Cooking',
                    text: 'Made lunch',
                    hour: '12 pm'
                },
                {
                    tag: 'Sleep',
                    text: '',
                    hour: '1 pm'
                }
            ]
        }
    },
    methods: {
        activityAdd() {

            this.display = "profile";
        }

    }
});