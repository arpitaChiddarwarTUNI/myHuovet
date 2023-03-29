# --------------------
## This file builds appointmentType API image using Golang image as base for code compiling.
# --------------------

FROM    golang:1.19.1

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY    . ./

EXPOSE      5009

RUN go build -v -o appointmentType
CMD /app/appointmentType