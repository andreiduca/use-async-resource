# useAsyncResource - data fetching hook for React Suspense

Convert any function that returns a Promise into a data reader function.
The data reader can then be consumed by a "suspendable" React component.

The hook also returns an updater handler that triggers new api calls.
The handler refreshes the data reader with each call.


## ✨ Basic usage

```
yarn add use-async-resource
```

then:

```tsx
import { useAsyncResource } from 'use-async-resource';

// a simple api function that fetches a user
const fetchUser = (id: number) => fetch(`.../get/user/by/${id}`).then(res => res.json());

function App() {
  // 👉 initialize the data reader and start fetching the user immediately
  const [userReader, getNewUser] = useAsyncResource(fetchUser, 1);

  return (
    <>
      <ErrorBoundary>
        <React.Suspense fallback="user is loading...">
          <User userReader={userReader} /* 👈 pass it to a suspendable child component */ />
        </React.Suspense>
      </ErrorBoundary>
      <button onClick={() => getNewUser(2)}>Get user with id 2</button>
      {/* clicking the button 👆 will start fetching a new user */}
    </>
  );
}

function User({ userReader }) {
  const userData = userReader(); // 😎 just call the data reader function to get the user object

  return <div>{userData.name}</div>;
}
```


### Data Reader and Refresh handler

The `useAsyncResource` hook returns a pair:
- the **data reader function**, which returns the expected result, or throws if the result is not yet available;
- a **refresh handler to fetch new data** with new parameters.

The returned data reader `userReader` is a function that returns the user object if the api call completed successfully.

If the api call has not finished, the data reader function throws the promise, which is caught by the `React.Suspense` boundary.
Suspense will retry to render the child component until it's successful, meaning the promised completed, the data is available, and the data reader doesn't throw anymore.

If the api call fails with an error, that error is thrown, and the `ErrorBoundary` component will catch it.

The refresh handler is identical with the original wrapped function, except it doesn't return anything - it only triggers new api calls.
The data is retrievable with the data reader function.

Notice the returned items are a pair, so you can name them whatever you want, using the array destructuring:

```tsx
const [userReader, getUser] = useAsyncResource(fetchUser, id);

const [postsReader, getPosts] = useAsyncResource(fetchPosts, category);

const [commentsReader, getComments] = useAsyncResource(fetchPostComments, postId, { orderBy: "date", order: "desc" });
```


### Api functions that don't accept parameters

If the api function doesn't accept any parameters, just pass an empty array as the second argument:

```tsx
const fetchToggles = () => fetch('/path/to/global/toggles').then(res => res.json());

// in App.jsx
const [toggles] = useAsyncResource(fetchToggles, []);
```

Just like before, the api call is immediately invoked and the `toggles` data reader can be passed to a suspendable child component.


## 🦥 Lazy initialization

All of the above examples are eagerly initialized, meaning the data starts fetching as soon as the `useAsyncResource` is called.
But in some cases you would want to start fetching data only after a user interaction.

To lazily initialize the data reader, just pass the api function without any parameters:

```tsx
const [userReader, getUserDetails] = useAsyncResource(fetchUserDetails);
```

Then use the refresh handler to start fetching data when needed:

```tsx
const [selectedUserId, setUserId] = React.useState();

const selectUserHandler = React.useCallback((userId) => {
  setUserId(userId);
  getUserDetails(userId); // 👈 call the refresh handler to trigger new api calls
}, []);

return (
  <>
    <UsersList onUserItemClick={selectUserHandler} />
    {selectedUserId && (
      <React.Suspense>
        <UserDetails userReader={userReader} />
      </React.Suspense>
    )}
  </>
);
```

The only difference between a lazy data reader and an eagerly initialized one is that
the lazy data reader can also return `undefined` if the data fetching hasn't stared yet.

Be aware of this difference when consuming the data in the child component:

```tsx
function UserDetails({ userReader }) {
  const userData = userReader();
  // 👆 this may be `undefined` at first, so we need to check for it

  if (userData === undefined) {
    return null;
  }

  return <div>{userData.username} - {userData.email}</div>
}
```


## 📦 Resource caching

All resources are cached, so subsequent calls with the same parameters for the same api function
return the same resource, and don't trigger new, identical api calls.

This is useful for many reasons. First, it means you don't have to necessarily initialize the data reader
in a parent component. You only have to wrap the child component in a Suspense boundary:

```tsx
function App() {
  return (
    <React.Suspense fallback="loading posts">
      <Posts />
    </React.Suspense>
  );
}

function Posts(props) {
  // as usual, initialize the data reader and start fetching the posts
  const [postsReader] = useAsyncResource(fetchPosts, []);

  // now read the posts and render a list
  const postsList = postsReader();

  return postsList.map(post => <Post post={post} />);
}
```

This still works as you'd expect, even if the `App` component re-renders for any other reason,
before, during or even after the posts have loaded. Because the data reader gets cached, only the first initialization will trigger an api call.


This also means you can write code like this, without having to think about deduplicating requests for the same user id:

```tsx
function App() {
  // just like before, start fetching posts
  const [postsReader] = useAsyncResource(fetchPosts, []);

  return (
    <React.Suspense fallback="loading posts">
      <Posts dataReader={postsReader} />
    </React.Suspense>
  );
}


function Posts(props) {
  // read the posts and render a list
  const postsList = props.dataReader();

  return postsList.map(post => <Post post={post} />);
}


function Post(props) {
  // start fetching users for each individual post
  const [userReader] = useAsyncResource(fetchUser, props.post.authorId);
  // 👉 notice we don't need to deduplicate the user resource for potentially identical author ids

  return (
    <article>
      <h1>{props.post.title}</h1>
      <React.Suspense fallback="loading author">
        <Author dataReader={userReader} />
      </React.Suspense>
      <p>{props.post.body}</p>
    </article>
  );
}


function Author(props) {
  // get the user object as usual
  const user = props.dataReader();

  return <div>{user.displayName}</div>;
}
```


### Preloading resources

When you know a resource will be consumed by a child component, you can preload it ahead of time.
This is useful in cases such as lazy loaded components, or when trying to predict a user's intent.

```tsx
// 👉 import the `preloadResource` helper
import { useAsyncResource, preloadResource } from 'use-async-resource';

// a lazy-loaded React component
const PostsList = React.lazy(() => import('./PostsListComponent'));

// some api function
const fetchUserPosts = (userId) => fetch(`/path/to/get/user/${userId}/posts`).then(res => res.json())


function UserProfile(props) {
  const [showPostsList, toggleList] = React.useState(false);

  return (
    <>
      <h1>{props.user.name}</h1>
      <button
        // show the list on button click
        onClick={() => toggleList(true)}
        // 👉 we can preload the resource as soon as the user
        // shows any intent of interacting with the button 
        onMouseOver={() => preloadResource(fetchUserPosts, props.user.id)}
      >
        show user posts
      </button>

      {showPostsList && (
        // this child will suspend if either:
        // - the `PostList` component code is not yet loaded
        // - or the data reader inside it is not yet ready
        // 👉 notice we're not initializing any resource to pass it to the child component
        <React.Suspense fallback="...loading posts">
          <PostsList userId={props.user.id} />
        </React.Suspense>  
      )}
    </>
  );
}

// in PostsListComponent.tsx
function PostsList(props) {
  // 👉 instead, we initialize the data reader inside the child component directly
  const [posts] = useAsyncResource(fetchUserPosts, props.userId);

  // ✨ because we preloaded it in the parent with the same `userId` parameter,
  // it will get initialized with that cached version

  // also, the outer React.Suspense boundary in the parent will take care of rendering the fallback
  return (
    <ul>
      {posts().map(post => <li><Post post={post} /></li>)}
    </ul>
  );
}
```

In the above example, even if the child component loads faster than the data,
re-rendering it multiple times until the data is ready is ok, because every time
the data reader will be initialized from the same cached version.
No api call will ever be triggered from the child component,
because that happened in the parent when the user hovered the button.

At the same time, if the data is ready before the code loads, it will be available immediately
when the child component will render for the first time. 

### Clearing caches

In some instances however, you really need to re-fetch a resource (after updating a piece of data for example),
so you'll need to clear the cached results. You can manually clear caches by using the `resourceCache` helper.

```tsx
import { useAsyncResource, resourceCache } from 'use-async-resource';

// ...

const [latestPosts, getPosts] = useAsyncResource(fetchLatestPosts, []);

const refreshLatestPosts = React.useCallback(() => {
  // 🧹 clear the cache so we can make a new api call
  resourceCache(fetchLatestPosts).clear();
  // 🙌 refresh the data reader
  getPosts();
}, []);
```

In this case, we're clearing the entire cache for the `fetchLatestPosts` api function.
But you can also use the `delete()` method with parameters, so you only delete the cache for those specific ones:

```tsx
const [user, getUser] = useAsyncResource(fetchUser, id);

const refreshUserProfile = React.useCallback((userId) => {
  // only clear the cache for that id
  resourceCache(fetchUser).delete(userId);
  // get new user data
  getUser(userId);
}, []);
```


## Data modifiers

When consumed, the data reader can take an optional argument: a function to modify the data.
This function receives the original data as a parameter, and the transformation logic is up to you.

```tsx
const userDisplayName = userDataReader(user => `${user.firstName} ${user.lastName}`);
```


## File resource helpers

Suspense is not just about fetching data in a declarative way, but about fetching resources in general, including images and scripts.

The included `fileResource` helper will turn a URL string into a resource "data reader" function, but it will load a resource instead of data.
When the resource finishes loading, the "data reader" function will return the URL you passed in. Until then, it will throw a Promise, so Suspense can render a fallback. 

Here's an example for an image resource:

```tsx
import { useAsyncResource, fileResource } from 'use-async-resource';

function Author({ user }) {
  // initialize the image "data reader"
  const [userImageReader] = useAsyncResource(fileResource.image, user.profilePicUrl);
    
  return (
    <article>
      {/* render a fallback until the image is downloaded */}
      <React.Suspense fallback={<SomeImgPlaceholder />}>
        {/* pass the resource "data reader" to a suspendable component */}
        <ProfilePhoto resource={userImageReader} />
      </React.Suspense>
      <h1>{user.name}</h1>
      <h2>{user.bio}</h2>
    </article>
  );
}

function ProfilePhoto(props) {
  // just read back the URL and use it in an `img` tag when the image is ready
  const imageSrc = props.resource();

  return <img src={imageSrc} />;
}
```

Using the `fileResource` to load external scripts is just as easy:

```tsx
function App() {
  const [jq] = useAsyncResource(fileResource.script, 'https://code.jquery.com/jquery-3.4.1.slim.min.js');

  return (
    <React.Suspense fallback="jQuery loading...">
      <JQComponent jQueryResource={jq} />
    </React.Suspense>
  );
}

function JQComponent(props) {
  const jQ = props.jQueryResource();

  // jQuery should be available and you can do something with it
  return <div>jQuery version: {window.jQuery.fn.jquery}</div>
}
```

Notice we don’t do anything with the `const jQ`, but we still need to call `props.jQueryResource()` so it can throw,
rendering the fallback until the library is fully loaded on the page.


## 📘 TypeScript support

The `useAsyncResource` hook infers all types from the api function passed in.
The arguments it accepts after the api function are exactly the parameters of the original api function.

```tsx
const fetchUser = (userId: number): Promise<UserType> => fetch('...');

const [wrongUserReader] = useAsyncResource(fetchUser, "some", "string", "params"); // 🚨 TS will complain about this
const [correctUserReader] = useAsyncResource(fetchUser, 1); // 👌 just right
const [lazyUserReader] = useAsyncResource(fetchUser); // 🦥 also ok, but lazily initialized
```

The only exception is the api function without parameters:
- the hook doesn't accept any other arguments than the api function, meaning it's lazily initialized;
- or it accepts a single extra argument, an empty array, when we want the resource to start loading immediately.

```tsx
const [lazyToggles] = useAsyncResource(fetchToggles); // 🦥 ok, but lazily initialized
const [eagerToggles] = useAsyncResource(fetchToggles, []); // 🚀 ok, starts fetching immediately
const [wrongToggles] = useAsyncResource(fetchToggles, "some", "params"); // 🚨 TS will complain about this
```


### Type inference for the data reader

The data reader will return exactly the type the original api function returns as a Promise.

```tsx
const fetchUser = (userId: number): Promise<UserType> => fetch('...');

const [userReader] = useAsyncResource(fetchUser, 1);
```

`userReader` is inferred as `() => UserType`, meaning a `function` that returns a `UserType` object.

If the resource is lazily initialized, the `userReader` can also return `undefined`:

```tsx
const [userReader] = useAsyncResource(fetchUser);
```

Here, `userReader` is inferred as `() => (UserType | undefined)`, meaning a `function` that returns either a `UserType` object, or `undefined`.


### Type inference for the refresh handler

Not just the data reader types are inferred, but also the arguments of the refresh handler:

```tsx
const fetchUser = (userId: number): Promise<UserType> => fetch('...');

const [userReader, getNewUser] = useAsyncResource(fetchUser, 1);
```

The `getNewUser` handler is inferred as `(userId: number) => void`, meaning a `function` that takes a numeric argument `userId`, but doesn't return anything.

Remember: the return type of the handler is always `void`, because the handler only kicks off new data api calls.
The data is still retrievable via the data reader function.


## Default Suspense and ErrorBoundary wrappers

Again, a component consuming a data reader needs to be wrapped in both a `React.Suspense` boundary and a custom `ErrorBoundary`.

For convenience, you can use the bundled `AsyncResourceContent` that provides both:

```tsx
import { useAsyncResource, AsyncResourceContent } from 'use-async-resource';

// ...

<AsyncResourceContent
  fallback="loading your data..."
  errorMessage="Some generic message when bad things happen"
>
  <SomeComponent consuming={aDataReader} />
</AsyncResourceContent>
```

The `fallback` can be a `string` or a React component.

The `errorMessage` can be either a `string`, a React component,
or a function that takes the thrown error as an argument and returns a `string` or a React component.

```tsx
<AsyncResourceContent
  fallback={<Spinner />}
  errorMessage={(e: CustomErrorType) => <span style={{ color: 'red' }}>{e.message}</span>}
>
  <SomeComponent consuming={aDataReader} />
</AsyncResourceContent>
```


### Custom Error Boundary

Optionally, you can pass a custom error boundary component to be used instead of the default one:

```tsx
class MyCustomErrorBoundary extends React.Component { ... }

// ...

<AsyncResourceContent
  // ...
  errorComponent={MyCustomErrorBoundary}
  errorMessage={/* optional error message */}
>
  <SomeComponent consuming={aDataReader} />
</AsyncResourceContent>
```

If you also pass the `errorMessage` prop, your custom error boundary will receive it as a prop.
