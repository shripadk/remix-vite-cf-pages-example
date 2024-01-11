# Introduction

Extending [@hi-ogawa](https://github.com/hi-ogawa)'s [Remix Example](https://github.com/hi-ogawa/vite-plugins/tree/main/packages/vite-node-miniflare/examples/remix) to include deploying to Cloudflare Pages

## Setup

**⚠️ CAUTION: Make sure to create a D1 database, KV store and R2 bucket in your Cloudflare Dashboard before proceeding. You can name the D1 database, KV store and R2 bucket anything you want. Just make sure to note the IDs of these after creation.**

Once you have done that, we will first create a new Cloudflare Pages app like so (we are calling it `remix-vite-deploy-pages`. if you choose any other name, make sure to change it in the `deploy` script in `package.json`):

```bash
$ npx wrangler pages project create remix-vite-deploy-pages --production-branch main
```

Once your Pages project is created, goto Cloudflare Dashboard to *Workers & Pages* > *Overview*, click on `remix-vite-deploy-pages`, then goto *Settings* > *Functions*. There scroll down to *KV namespace bindings*, click *Add binding* and set *VARIABLE_NAME* to **SESSION** for this example. Then choose the KV namespace to be the namespace your created above.

Similarly, scroll down below to *R2 bucket bindings*, click *Add binding* and set *VARIABLE_NAME* to **IMAGE_BUCKET** and choose the R2 bucket you created.

Then scroll down below to *D1 database bindings*, click *Add binding* and set *VARIABLE_NAME* to **DB** and choose the D1 database you created.

Then let us install the project dependencies:

```bash
$ npm install
```

Edit the `wrangler.toml` file and set the IDs for all the bindings defined above. For example, copy the *ID* from your *KV store* and replace `<ADD_YOUR_PRODUCTION_ID_HERE>` with the *ID*. Do that for R2 production bucket and D1 production database too. Then we need to run migrations for both local and production D1 database. You can run it this way:

```bash
# for local database
$ npx wrangler d1 migrations apply DB --local

# for production database
$ npx wrangler d1 migrations apply DB_PRODUCTION
```

## Run

To run the project, execute the following command:

```bash
$ npm run dev
```

## Build & Publish

To build and publish, execute the following commands:

```bash
$ npm run build
$ npm run deploy
```

## Tail logs

To tail logs, execute the following command:

```bash
$ npx wrangler pages deployment tail
```

And then choose your project, viz., `remix-vite-deploy-pages`.

## wrangler.toml

The `wrangler.toml` file contains all the bindings needed to interact with both local and production environments. Give the ids/bucket names to the same value as the binding for interacting with local environments. For production, you can add a `_PRODUCTION` suffix to interact with production environments and provide actual IDs as generated in your Cloudflare Dashboard.

For local you will probably have to pass in the `--local` flag when using `wrangler` (depending on the command). For example, to run D1 migrations you can do something like this:

```bash
# for local database migrations (note the --local flag)
$ npx wrangler d1 migrations apply DB --local

$ ls .wrangler/state/v3/d1/miniflare-D1DatabaseObject/                                                            (base)
e7352547963de7050bd7d94658afc4fe78b61811b7815da12d90be8e863abf4d.sqlite

$ sqlite3 .wrangler/state/v3/d1/miniflare-D1DatabaseObject/e7352547963de7050bd7d94658afc4fe78b61811b7815da12d90be8e863abf4d.sqlite
SQLite version 3.44.2 2023-11-24 11:41:44
Enter ".help" for usage hints.
sqlite> .tables
Users       _cf_KV      migrations
sqlite> .schema Users
CREATE TABLE IF NOT EXISTS "Users" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE
);
sqlite> .quit

# for production database migrations
$ npx wrangler d1 migrations apply DB_PRODUCTION
```

**⚠️ NOTE: The `_PRODUCTION` bindings in `wrangler.toml` file are totally optional. They are only needed if you wish to interact with the production environment using the `wrangler` CLI tool. But it is definitely needed if you are using D1 as it makes it really easy to apply migrations to the production environment before deployment - else the deployment obviously fails as the schema on the production environment is not synced with the code changes. When setting the binding names in the Cloudflare Dashboard, you will set it to the plain binding name **WITHOUT** the `_PRODUCTION` suffix.

And for local environment, the binding name and ID should be the same. This makes it easy to use `wrangler` CLI tool to also interact with local environment. So if you set `KV` to be the binding for a KV store, then set id to also be `KV`.**

## app/env.d.ts

Modify the `env` declaration in env.d.ts file if you make any changes to your bindings.

## migrations

All D1 database migrations are in the **migrations** folder. They can be created by running the following command:

```bash
# npx wrangler d1 migrations create <database/binding> <message>
$ npx wrangler d1 migrations create DB add-new-table-customers 
```

and then applied like so:

```bash
# for local
$ npx wrangler d1 migrations apply DB --local

# for production
$ npx wrangler d1 migrations apply DB_PRODUCTION
```

## CREDITS

1. Based on [@hi-ogawa](https://github.com/hi-ogawa)'s [Remix Example](https://github.com/hi-ogawa/vite-plugins/tree/main/packages/vite-node-miniflare/examples/remix) to include deploying to Cloudflare Pages
2. Discussions: [Issue 153](https://github.com/hi-ogawa/vite-plugins/issues/153)
