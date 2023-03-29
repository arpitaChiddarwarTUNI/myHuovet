# --------------------
## This file builds medicine API image using Golang image as base for code compiling.
# --------------------

FROM    golang:1.19.1

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY    . ./

EXPOSE      5006

RUN go build -v -o medicine
CMD /app/medicine