import {gql} from "graphql-request"
import sortByImage from "./sortByImage";

const fetchNews = async (
    category?: Category|string, 
    keywords?: string, 
    isDynamic?:boolean) =>{
    
    // GraphQL query
    const query = gql`
    query myQuery(
        $access_key: String!, 
        $categories: String!, 
        $keywords: String,
    ) {
        myQuery(
            access_key: $access_key
            categories: $categories
            keywords: $keywords
            countries: "us"
            sort: "published_desc"
            ) {
          data {
            author
            category
            country
            description
            image
            language
            published_at
            source
            title
            url
          }
          pagination {
            count
            limit
            offset
            total
          }
        }
      }`

    // With caching, isr
    const res = await fetch("https://zhezqazghan.stepzen.net/api/ill-iguana/__graphql", {
        method: 'POST',
        cache: isDynamic? "no-cache" : "default",
        next: isDynamic? {revalidate: 0} : {revalidate: 20},
        headers:{
            "Content-Type": "application/json",
            Authorization: `APIKey ${process.env.STEPZEN_API_KEY}`,
        },
        body: JSON.stringify({
            query,
            variables:{
                access_key: process.env.MEDIASTACK_API_KEY,
                categories: category,
                keywords: keywords,
            } 
        })
    })
    const newsResponse = await res.json();

    // console.log(newsResponse)

    const news = sortByImage(newsResponse.data.myQuery);

    return news;
}

export default fetchNews;