import { Route, Switch } from "wouter";
import BlogIndex from "@/pages/BlogIndex";
import BlogPost from "@/pages/BlogPost";

function IndexPage() {
  return <BlogIndex />;
}

function PostPage() {
  return <BlogPost />;
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={IndexPage} />
      <Route path="/:slug" component={PostPage} />
    </Switch>
  );
}
