# --------------------
## This file builds customer API image using Golang image as base for code compiling.
# --------------------

FROM    golang:1.19.1

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY    . ./

EXPOSE      5002

RUN go build -v -o customer
CMD /app/customer