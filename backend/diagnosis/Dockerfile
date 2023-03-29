# --------------------
## This file builds diagnosis API image using Golang image as base for code compiling.
# --------------------

FROM    golang:1.19.1

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY    . ./

EXPOSE      5011

RUN go build -v -o diagnosis
CMD /app/diagnosis