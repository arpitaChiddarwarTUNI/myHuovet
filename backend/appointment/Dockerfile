# --------------------
## This file builds appointment API image using Golang image as base for code compiling.
# --------------------

FROM    golang:1.19.1

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY    . ./

EXPOSE      5001

RUN go build -v -o appointment
CMD /app/appointment