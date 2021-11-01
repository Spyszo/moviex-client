import "./TvSeriesCollection.scss"
import TvSeries from "../../TvSeries"

const TvSeriesCollection = (props) => {
    return (
        <div className="tvSeriesCollection">
            {props.tvSeries.map((tvSeries, i) => <TvSeries key={i} data={tvSeries}/>)}
        </div>
    )
}

export default TvSeriesCollection