import Link from "next/link"
import {LinkIt, LinkItUrl} from "react-linkify-it"

interface LinkifyProps {
    children: React.ReactNode
}

export default function Linkify({children}: LinkifyProps) {
    return(
        <LinkifyUsername>
        <LinkifyHashtag>
        <LinkyfyUrl>
        {children}
        </LinkyfyUrl>
        </LinkifyHashtag>
        </LinkifyUsername>
       
    )
}

function LinkyfyUrl({children}: LinkifyProps) {
    return <LinkItUrl className="text-primary hover:underline">
        {children}
    </LinkItUrl>
}

function LinkifyUsername({children}: LinkifyProps){
    return (
    <LinkIt regex={/(@[a-zA-Z0-9_]+)/}
    component={(match, key)=>{
        
        return (
        <Link key={key} href={`/home/users/${match.slice(1)}`} className="text-primary hover:underline">{match}
        </Link>
        );
    }}
>
    {children}
</LinkIt>
);

}

function LinkifyHashtag({children}: LinkifyProps){
   return(<LinkIt regex={/(#[a-zA-Z0-9_]+)/}
   component={(match, key)=>(
    <Link key={key} href={`/hashtag/${match.slice(1)}`} className="text-primary hover:underline">{match}</Link>)}>
    {children}
    </LinkIt>
   );
    }