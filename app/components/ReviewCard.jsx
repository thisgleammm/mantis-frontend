import { Link } from "react-router";

function ReviewCard({ ReviewCard }) {
    return (
        <div>
            <h2>{review.name}</h2>
            <Link to={'/review/${review.id}'} >Review</Link>
        </div>
    )
}

export default ReviewCard