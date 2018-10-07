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
        count: 0,
        display: "profile",
        isEditing: true,
        selectedYear: "",
        selectedMonth: "",
        selectedDay: "",
        years: [
            '2017', '2018', '2019'
        ],
        months: [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ],
        days: [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '23', '24', '25', '26', '27', '28', '29', '30', '31'
        ],

        pie: [{
                percent: 0.10
            },
            {
                percent: 0.65
            },
            {
                percent: 0.25
            },
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
    }
});