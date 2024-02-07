import {makeAutoObservable} from "mobx";
import axios from "../axios/index.js";
import {sortDate} from "../utils/sortDate.js";

export default class ganttStore {
    constructor() {
        this.allCharts = []
        this.currentChart = []
        makeAutoObservable(this);
    }

    setAllCharts(charts){
        this.allCharts = charts
    }
    setCurrentChart(chart){
        this.currentChart = chart
    }

    get getAllCharts(){
        return this.allCharts
    }
    get getCurrentChart(){
        return this.currentChart
    }

    async loadAllCharts(params) {
        const response = await axios.get(`tasks?page=${params.page}&limit=${params.limit}`).then(res=> {
            this.setAllCharts(sortDate(res.data))
            console.log(res.data)
        }).catch(res=> {

        })

        return this.allCharts
    }


    async loadCurrentChart(params){
        const responce = await axios.get(`tasks/${params.id}?page=${params.page}&limit=${params.limit}`).then(res=> {
            const array = []
            array.push(res.data.task.task)
            res.data.children.tasks.map((task)=> (
                array.push(task)
            ))
            this.setCurrentChart(array)
        }).catch(res=> {

        })

        return this.currentChart
    }
}