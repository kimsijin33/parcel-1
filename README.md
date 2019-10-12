# Parcel

[![Snap Status](https://build.snapcraft.io/badge/nsg/snap-mailserver.svg)](https://build.snapcraft.io/user/nsg/snap-mailserver)

## About this snap

This snap will setup all you need to run a e-mail server of your own. This
snap will provision several LXD containers containing all software and
configuration.

## Requirements

You need LXD, installed locally with the lxd snap (`snap install lxd`).

## Simplified overview

The picture below is a simplified overview of a Parcel install. HAProxy is a
reverse proxy that routes traffic, it's used to send traffic back and forth
between different components. The actual mailserver software are running inside
LXD containers, in this example all on the same server.

![Simplified Parcel overview](docs/images/parcel-local.png)

## Install

Install the snap on a public server, preferably not on a home server due the
fact that most home connects are blacklisted due to spam.

```
$ snap install parcel
```

The above command will install the stable release, this are the available channels. Install them with `snap install --candidate parcel`.

| Channel | Description |
| ------- | ----------- |
| stable  | A tested stable release, recommended for most users |
| candidate | The upcoming stable release, I think this one is stable but it's here to test it before I promote it to stable |
| beta | Beta releases for more experimental upcoming releases, please report bugs. |
| edge | The latest code in master of this repository, this is **absolutely not** stable |

Now run `parcel` in a terminal and follow the instructions.

## History

A few years back I moved away from Gmail to my self hosted solution and
I have been happy with the result. This snap is the second iteration of
that install. This install will probably be different compared to the
original one, but it is still based around my needs and what I think
a mail server should contain.
